import PreventionPlan from "../models/PreventionPlan.js";
import { callGroqAPI } from "../services/groqService.js";
import { RiskResult } from "../models/RiskResult.js";
import User from "../models/userModel.js";

// 🧠 Generate Personalized Prevention Plan Automatically
export const personalizedPrevention = async (req, res) => {
  try {
    // 1️⃣ Ensure authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.user._id;

    // 2️⃣ Fetch the latest disease & risk_score from RiskResult model
    const latestResult = await RiskResult.findOne({ uploadedBy: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!latestResult || !latestResult.identifiedRisks?.length) {
      return res.status(404).json({
        error: "No risk data found. Please upload your health file first.",
      });
    }

    const topRisk = latestResult.identifiedRisks[0];
    const disease = topRisk.risk_name;
    const risk_score = topRisk.probability;

    const riskScore = risk_score || 0.5;
    const riskLevel =
      riskScore >= 0.7 ? "high" : riskScore >= 0.4 ? "moderate" : "low";

    // 3️⃣ Sync the disease & risk_score into the User profile for easy tracking
    await User.findByIdAndUpdate(
      userId,
      { disease, risk_score },
      { new: true }
    );

    // 4️⃣ Build prompt for Groq API
    const prompt = `
    You are a clinical AI generating structured, evidence-based personalized prevention plans.
    A patient has a ${riskLevel} genetic risk (probability = ${riskScore}) for ${disease}.
    
    Create a comprehensive, medically-valid prevention plan following these clinical guidelines:
    - For cardiovascular diseases: ACC/AHA guidelines
    - For diabetes: ADA standards of care
    - For cancer: NCCN guidelines
    - General prevention: USPSTF recommendations
    
    Generate the plan in strict JSON format with this structure:
    {
      "disease": "${disease}",
      "risk_score": ${riskScore},
      "risk_level": "${riskLevel}",
      "diet_plan": {
        "nutritional_goals": ["specific macro/micro nutrient targets"],
        "weekly_meal_structure": {
          "monday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
          "tuesday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
          "wednesday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
          "thursday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
          "friday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
          "saturday": {"breakfast": "...", "lunch": "...", "dinner": "..."},
          "sunday": {"breakfast": "...", "lunch": "...", "dinner": "..."}
        },
        "foods_to_include": ["list of beneficial foods"],
        "foods_to_avoid": ["list of restricted foods"]
      },
      "medication_and_monitoring": {
        "preventive_medications": ["medications with dosage if applicable"],
        "supplements": ["evidence-based supplements"],
        "screening_schedule": {"tests": ["list"], "frequency": "timeline"},
        "biomarker_targets": {"key_metrics": ["list"], "target_ranges": "values"}
      },
      "lifestyle_plan": {
        "exercise_regimen": {"aerobic": "...", "strength": "...", "frequency": "..."},
        "sleep_optimization": {"duration": "...", "quality_measures": "..."},
        "stress_management": {"techniques": ["list"], "frequency": "..."},
        "substance_avoidance": ["specific substances to avoid"],
        "environmental_factors": ["considerations for prevention"]
      },
      "risk_reduction_targets": {
        "short_term_goals": ["3-6 month targets"],
        "long_term_goals": ["1-5 year targets"],
        "success_metrics": ["measurable outcomes"]
      },
      "clinical_guidelines_reference": "Specific guideline citations and evidence levels"
    }
    
    Tailor the plan aggressively for ${riskLevel} risk level. Include specific dosages, frequencies, and measurable targets.
    Return ONLY valid JSON without any markdown or explanatory text.
    `;

    // 5️⃣ Call Groq API
    const response = await callGroqAPI(prompt);

    let plan;
    try {
      // Clean JSON
      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.slice(7);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.slice(0, -3);
      }
      plan = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      plan = getFallbackPlan(disease, riskScore, riskLevel);
    }

    // 6️⃣ Store prevention plan in DB
    const preventionPlan = new PreventionPlan({
      userId,
      disease,
      riskScore,
      riskLevel,
      dietPlan: plan.diet_plan?.weekly_meal_structure || {},
      medicationAndMonitoring: {
        recommendedMeds: [
          ...(plan.medication_and_monitoring?.preventive_medications || []),
          ...(plan.medication_and_monitoring?.supplements || []),
        ],
        monitoringSchedule:
          plan.medication_and_monitoring?.screening_schedule || {},
      },
      lifestylePlan: plan.lifestyle_plan || {},
      clinicalGuidelinesReference: plan.clinical_guidelines_reference,
    });

    await preventionPlan.save();

    // 7️⃣ Return success
    res.json({
      status: "success",
      generatedAt: new Date().toISOString(),
      personalizedPlan: plan,
    });
  } catch (error) {
    console.error("Personalized prevention error:", error);
    const fallbackPlan = getFallbackPlan("Unknown Disease", 0.5, "moderate");

    res.status(200).json({
      status: "fallback",
      error: error.message,
      personalizedPlan: fallbackPlan,
    });
  }
};

// 🩺 Fallback plan if Groq fails
const getFallbackPlan = (disease, riskScore, riskLevel) => {
  return {
    disease,
    risk_score: riskScore,
    risk_level: riskLevel,
    diet_plan: {
      nutritional_goals: ["Balanced macronutrients", "Reduced processed foods"],
      weekly_meal_structure: {},
      foods_to_include: ["Vegetables", "Lean proteins", "Whole grains"],
      foods_to_avoid: ["Processed foods", "Excessive sugar", "Trans fats"],
    },
    medication_and_monitoring: {
      preventive_medications: ["Consult healthcare provider"],
      supplements: ["Vitamin D", "Omega-3"],
      screening_schedule: { tests: ["Annual physical"], frequency: "Yearly" },
      biomarker_targets: {
        key_metrics: ["BMI", "Blood pressure"],
        target_ranges: "Healthy ranges",
      },
    },
    lifestyle_plan: {
      exercise_regimen: {
        aerobic: "150 mins/week",
        strength: "2 days/week",
        frequency: "Regular",
      },
      sleep_optimization: {
        duration: "7-9 hours",
        quality_measures: "Consistent schedule",
      },
      stress_management: {
        techniques: ["Meditation", "Breathing exercises"],
        frequency: "Daily",
      },
      substance_avoidance: ["Tobacco", "Excessive alcohol"],
      environmental_factors: [
        "Avoid pollutants",
        "Maintain healthy environment",
      ],
    },
    risk_reduction_targets: {
      short_term_goals: [
        "Establish baseline metrics",
        "Implement lifestyle changes",
      ],
      long_term_goals: ["Reduce disease risk", "Maintain optimal health"],
      success_metrics: ["Improved biomarkers", "Reduced risk factors"],
    },
    clinical_guidelines_reference: "Standard preventive care guidelines",
  };
};
