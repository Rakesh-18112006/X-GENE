import { parseFile, sendToFlask } from "../services/fileService.js";
import { RiskResult } from "../models/RiskResult.js";


export const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { buffer, originalname: fileName } = req.file;
    const parsedData = await parseFile(buffer, fileName);
    const prediction = await sendToFlask(buffer, fileName);

    if (prediction.status !== "success") {
      return res.status(400).json({
        error: "Flask API processing failed",
        details: prediction.error || "Unknown error from Flask",
      });
    }

    const { identified_risks } = prediction;

    // ✅ Store user-specific result
    const newResult = new RiskResult({
      fileName,
      uploadedBy: req.user._id, // authenticated user's ID
      identifiedRisks: identified_risks.map((risk) => ({
        risk_name: risk.risk_name,
        probability: risk.probability,
        reason: risk.reason,
      })),
    });

    await newResult.save();

    res.json({
      message: "File processed and stored for this user",
      user: req.user.email,
      identifiedRisks: newResult.identifiedRisks,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to process file",
      details: error.message,
    });
  }
};

export const getUserRiskResults = async (req, res) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    // Fetch all results linked to this user
    const results = await RiskResult.find({ uploadedBy: req.user._id })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    if (results.length === 0) {
      return res.status(200).json({ message: "No risk predictions found." });
    }

    res.status(200).json({
      message: "User risk predictions fetched successfully.",
      total: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch user risk predictions",
      details: error.message,
    });
  }
};
