import DriftPattern from "../models/DriftPattern.js";
import LifestyleTrend from "../models/LifestyleTrend.js";
import MedicalReport from "../models/MedicalReport.js";
import PreventionPlan from "../models/PreventionPlan.js";
import User from "../models/userModel.js"; // ✅ to get email from DB
import { callGroqAPI } from "../services/groqService.js";
import nodemailer from "nodemailer";

const analyzeDriftPatterns = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.user._id;

    // Fetch user-related data
    const [lifestyleTrends, medicalReports, preventionPlans] =
      await Promise.all([
        LifestyleTrend.find({ userId }).sort({ date: -1 }).limit(30),
        MedicalReport.find({ userId }).sort({ uploadDate: -1 }),
        PreventionPlan.find({ userId }).sort({ generatedAt: -1 }),
      ]);

    if (lifestyleTrends.length === 0 && medicalReports.length === 0) {
      return res.status(400).json({
        error: "Insufficient data for drift analysis",
      });
    }

    // Prepare input for Groq LLM
    const analysisData = prepareAnalysisData(
      lifestyleTrends,
      medicalReports,
      preventionPlans
    );

    const prompt = `
    As a clinical AI analyst, analyze this patient's health data to establish their health baseline and identify early warning trends.

    PATIENT DATA FOR ANALYSIS:
    ${JSON.stringify(analysisData, null, 2)}

    Provide a comprehensive drift pattern analysis in strict JSON format:
    {
      "health_baseline": {...},
      "early_warnings": [...],
      "visualization_parameters": {...},
      "overall_risk_assessment": {
        "level": "high/medium/low",
        "trend": "improving/stable/deteriorating",
        "confidence": 0.0-1.0
      },
      "recommendations": ["list of specific recommendations"]
    }

    Return ONLY valid JSON.
    `;

    let analysis;
    try {
      const response = await callGroqAPI(prompt, 0.2, 2500);

      // Clean and parse the response
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```json"))
        cleanedResponse = cleanedResponse.slice(7);
      if (cleanedResponse.endsWith("```"))
        cleanedResponse = cleanedResponse.slice(0, -3);
      analysis = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Drift analysis error:", error);

      // Handle rate limit errors specifically
      if (error?.error?.code === "rate_limit_exceeded") {
        const retryAfterMinutes = Math.ceil(
          parseRetryAfterTime(error?.error?.message) / 60
        );
        console.log(
          `Rate limit exceeded. Retry after ${retryAfterMinutes} minutes`
        );

        return res.status(429).json({
          error: "Rate limit exceeded",
          retryAfter: retryAfterMinutes,
          message:
            "Analysis temporarily unavailable due to high demand. Please try again later.",
          fallbackAnalysis: generateSimplifiedAnalysis(
            lifestyleTrends,
            medicalReports
          ),
        });
      }

      // For other errors, use fallback
      analysis = getFallbackDriftAnalysis();
    }

    // Save drift analysis
    const driftPattern = new DriftPattern({
      userId,
      healthBaseline: analysis.health_baseline,
      earlyWarnings: analysis.early_warnings,
      visualizationParameters: analysis.visualization_parameters,
      overallRiskAssessment: analysis.overall_risk_assessment,
      recommendations: analysis.recommendations,
    });

    await driftPattern.save();

    // ✅ If high risk, trigger email alert
    if (analysis.overall_risk_assessment?.level === "high") {
      const user = await User.findById(userId);
      if (user && user.email) {
        await sendHighRiskEmail(user.email, analysis);
      }
    }

    res.json({
      status: "success",
      analysisDate: new Date().toISOString(),
      driftAnalysis: analysis,
    });
  } catch (error) {
    console.error("Drift pattern analysis error:", error);
    res.status(500).json({
      error: "Failed to analyze drift patterns",
      fallbackAnalysis: getFallbackDriftAnalysis(),
    });
  }
};

// ====================== Helper Functions ======================

const prepareAnalysisData = (
  lifestyleTrends,
  medicalReports,
  preventionPlans
) => {
  const data = {
    lifestyle_patterns: {
      recent_summaries: lifestyleTrends.slice(0, 7).map((t) => ({
        date: t.date,
        summary: t.summary,
        quality_score: t.metadata?.qualityScore,
        risk_factors: t.metadata?.riskFactors,
      })),
      trends: {
        sleep_consistency: calculateSleepConsistency(lifestyleTrends),
        exercise_frequency: calculateExerciseFrequency(lifestyleTrends),
        diet_quality: calculateDietQuality(lifestyleTrends),
      },
    },
    medical_insights: {
      recent_reports: medicalReports.slice(0, 5).map((r) => ({
        type: r.reportType,
        summary: r.summary,
        key_metrics: r.metrics,
      })),
    },
    genetic_risks: preventionPlans.map((p) => ({
      disease: p.disease,
      risk_level: p.riskLevel,
      risk_score: p.riskScore,
    })),
    time_span: {
      lifestyle_days: lifestyleTrends.length,
      medical_reports_count: medicalReports.length,
    },
  };
  return data;
};

// Sleep, Exercise, Diet calculations
const calculateSleepConsistency = (trends) => {
  if (trends.length === 0) return "unknown";
  const avgSleep =
    trends.reduce((sum, t) => sum + (t.sleepHours || 0), 0) / trends.length;
  return avgSleep >= 7 ? "good" : avgSleep >= 6 ? "moderate" : "poor";
};

const calculateExerciseFrequency = (trends) => {
  const exerciseDays = trends.filter(
    (t) => t.exercise && t.exercise !== "Not specified" && t.exercise !== "None"
  ).length;
  const frequency = exerciseDays / trends.length;
  return frequency >= 0.7 ? "high" : frequency >= 0.4 ? "moderate" : "low";
};

const calculateDietQuality = (trends) => {
  const healthyDietCount = trends.filter(
    (t) =>
      t.diet &&
      !t.diet.toLowerCase().includes("fast food") &&
      !t.diet.toLowerCase().includes("processed")
  ).length;
  return healthyDietCount / trends.length >= 0.6 ? "good" : "needs_improvement";
};

// ✅ Groq-generated fallback
// Helper function to parse retry time from error message
const parseRetryAfterTime = (message) => {
  try {
    const match = message.match(/try again in (\d+)m([\d.]+)s/);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseFloat(match[2]);
      return minutes * 60 + seconds;
    }
    return 1800; // Default 30 minutes if can't parse
  } catch (err) {
    return 1800;
  }
};

// Simplified analysis based on raw data without AI
const generateSimplifiedAnalysis = (lifestyleTrends, medicalReports) => {
  const sleepConsistency = calculateSleepConsistency(lifestyleTrends);
  const exerciseFrequency = calculateExerciseFrequency(lifestyleTrends);
  const dietQuality = calculateDietQuality(lifestyleTrends);

  // Determine basic risk level
  const riskFactors = [];
  if (sleepConsistency === "poor") riskFactors.push("Poor sleep consistency");
  if (exerciseFrequency === "low") riskFactors.push("Low exercise frequency");
  if (dietQuality === "needs_improvement")
    riskFactors.push("Diet needs improvement");

  const riskLevel =
    riskFactors.length >= 2
      ? "high"
      : riskFactors.length === 1
      ? "medium"
      : "low";

  return {
    health_baseline: {
      description: "Basic analysis based on recent lifestyle data",
      parameters: {
        stable_metrics: ["sleep_pattern", "exercise_routine", "diet_quality"],
        variable_metrics: [],
        overall_stability: riskLevel === "low" ? "stable" : "variable",
      },
      stable_period: "Last " + lifestyleTrends.length + " days",
    },
    early_warnings: riskFactors,
    visualization_parameters: {
      charts_needed: ["lifestyle_trends"],
      key_metrics_to_plot: [
        "sleep_hours",
        "exercise_frequency",
        "diet_quality",
      ],
      risk_indicators: [
        {
          indicator: "Sleep",
          status: sleepConsistency,
          trend: sleepConsistency === "good" ? "stable" : "needs_improvement",
        },
        {
          indicator: "Exercise",
          status: exerciseFrequency,
          trend: exerciseFrequency === "high" ? "stable" : "needs_improvement",
        },
        {
          indicator: "Diet",
          status: dietQuality,
          trend: dietQuality === "good" ? "stable" : "needs_improvement",
        },
      ],
    },
    overall_risk_assessment: {
      level: riskLevel,
      trend: riskLevel === "low" ? "stable" : "needs_attention",
      confidence: 0.7,
    },
    recommendations: [
      ...riskFactors.map((factor) => `Address ${factor.toLowerCase()}`),
      "Continue tracking lifestyle patterns",
      "Schedule regular health check-ups",
    ],
  };
};

const getFallbackDriftAnalysis = () => ({
  health_baseline: {
    description: "Insufficient data for comprehensive analysis.",
    parameters: {
      stable_metrics: [],
      variable_metrics: ["All metrics require more data"],
      overall_stability: "unknown",
    },
    stable_period: "Not established",
  },
  early_warnings: [],
  visualization_parameters: {
    charts_needed: ["lifestyle_trends", "risk_scores"],
    key_metrics_to_plot: ["sleep_hours", "exercise_frequency", "diet_quality"],
    risk_indicators: [
      {
        indicator: "Data Sufficiency",
        status: "warning",
        trend: "needs_improvement",
      },
    ],
  },
  overall_risk_assessment: {
    level: "unknown",
    trend: "unknown",
    confidence: 0.3,
  },
  recommendations: [
    "Continue tracking lifestyle for 2-4 weeks",
    "Upload recent medical reports for better analysis",
  ],
});

// ====================== Email Sending ======================

const sendHighRiskEmail = async (email, analysis) => {
  try {
    // Generate subject & body using Groq LLM
    const emailPrompt = `
    The patient has been flagged as HIGH RISK in their drift analysis.
    Generate a professional, clinically appropriate email alert.
    Return JSON only:
    {
      "subject": "email subject",
      "body": "email body"
    }

    Input context:
    ${JSON.stringify(analysis, null, 2)}
    `;

    const response = await callGroqAPI(emailPrompt, 0.3, 500);
    let cleaned = response.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
    const { subject, body } = JSON.parse(cleaned);

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"X-GENE Health Alert" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `<p>${body}</p>`,
    });

    console.log(`📧 High risk alert sent to ${email}`);
  } catch (err) {
    console.error("Error sending high-risk email:", err);
  }
};

// ====================== History Fetch ======================

const getDriftHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const analyses = await DriftPattern.find({ userId }).sort({
      analysisDate: -1,
    });

    res.json({
      status: "success",
      count: analyses.length,
      analyses: analyses.map((a) => ({
        id: a._id,
        analysisDate: a.analysisDate,
        overallRisk: a.overallRiskAssessment?.level,
        earlyWarningsCount: a.earlyWarnings?.length || 0,
        recommendations: a.recommendations?.slice(0, 3),
      })),
    });
  } catch (error) {
    console.error("Get drift history error:", error);
    res.status(500).json({ error: "Failed to fetch drift analysis history" });
  }
};

export { analyzeDriftPatterns, getDriftHistory };
