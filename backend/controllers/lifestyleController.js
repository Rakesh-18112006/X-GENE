import LifestyleTrend from "../models/LifestyleTrend.js";
import { callGroqAPI } from "../services/groqService.js";

const analyzeLifestyle = async (req, res) => {
  try {

     if (!req.user || !req.user._id) {
       return res.status(401).json({ error: "Unauthorized. Please log in." });
     }

     const userId = req.user._id;

    const { exercise, waterIntake, diet, habits, sleepHours } =
      req.body;

    if (!userId) {
      return res.status(400).json({
        error: "Missing userId",
      });
    }

    const lifestyleData = {
      exercise: exercise || "Not specified",
      waterIntake: waterIntake || "Not specified",
      diet: diet || "Not specified",
      habits: habits || [],
      sleepHours: sleepHours || 0,
    };

    // Improved prompt for better analysis
    const prompt = `
    As a preventive health AI, analyze this lifestyle data and provide exactly 2 concise sentences.
    
    Lifestyle Data:
    ${JSON.stringify(lifestyleData, null, 2)}
    
    First Sentence: Identify the key health patterns and their immediate implications.
    Second Sentence: Provide specific preventive insight focusing on metabolic, cardiac, or stress-related risks.
    
    Be clinically precise and focus on actionable insights. Return exactly 2 sentences separated by a newline.
    `;

    const response = await callGroqAPI(prompt, 0.4, 150);

    let summary = response.trim();
    const lines = summary
      .split("\n")
      .filter((line) => line.trim())
      .slice(0, 2);
    summary = lines.join("\n");

    // Calculate quality score
    const qualityScore = calculateQualityScore(lifestyleData);

    // Save to database
    const lifestyleTrend = new LifestyleTrend({
      userId,
      ...lifestyleData,
      summary,
      metadata: {
        qualityScore,
        riskFactors: extractRiskFactors(lifestyleData),
      },
    });

    await lifestyleTrend.save();

    res.json({
      status: "success",
      summary,
      qualityScore,
      date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Lifestyle analysis error:", error);
    res.status(200).json({
      status: "fallback",
      summary:
        "Healthy routine with moderate exercise and hydration. Maintain consistency to reduce long-term metabolic and cardiac risks.",
      qualityScore: 0.7,
      date: new Date().toISOString(),
    });
  }
};

const calculateQualityScore = (data) => {
  let score = 0.5; // Base score

  if (data.exercise && data.exercise !== "Not specified") score += 0.2;
  if (data.waterIntake && parseFloat(data.waterIntake) >= 2) score += 0.15;
  if (data.sleepHours && data.sleepHours >= 7) score += 0.15;
  if (!data.habits.includes("Smoking")) score += 0.1;

  return Math.min(score, 1.0);
};

const extractRiskFactors = (data) => {
  const factors = [];

  if (data.sleepHours && data.sleepHours < 6)
    factors.push("Insufficient sleep");
  if (data.exercise === "Not specified" || !data.exercise)
    factors.push("Sedentary lifestyle");
  if (data.diet && data.diet.toLowerCase().includes("sugar"))
    factors.push("High sugar diet");
  if (
    data.habits &&
    data.habits.some((h) => h.toLowerCase().includes("alcohol"))
  )
    factors.push("Alcohol consumption");

  return factors;
};

const getLifestyleHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await LifestyleTrend.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: -1 });

    res.json({
      status: "success",
      count: trends.length,
      trends,
    });
  } catch (error) {
    console.error("Get lifestyle history error:", error);
    res.status(500).json({
      error: "Failed to fetch lifestyle history",
    });
  }
};

export { analyzeLifestyle, getLifestyleHistory };
