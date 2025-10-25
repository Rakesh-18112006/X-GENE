import MedicalReport from "../models/MedicalReport.js";
import pdfParse from "pdf-parse";
import { callGroqAPI } from "../services/groqService.js";
import fs from "fs";

const uploadMedicalReport = async (req, res) => {
  let filePath = null; // Declare filePath with let

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.user._id;
    filePath = req.file.path; // Now properly defined

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedContent = pdfData.text;

    if (!extractedContent || extractedContent.trim().length === 0) {
      throw new Error("No text content extracted from PDF");
    }

    // Generate summary using Groq
    const prompt = `
    Analyze this medical report and provide a concise clinical summary focusing on:
    1. Key findings and abnormal values
    2. Risk factors identified
    3. Preventive health implications
    4. Recommended follow-up actions
    
    Medical Report Content:
    ${extractedContent.substring(0, 3000)}
    
    Provide the summary in 3-4 bullet points maximum, focusing on actionable insights for preventive health.
    `;

    const summary = await callGroqAPI(prompt, 0.3, 300);

    // Extract metrics
    const metrics = extractMetrics(extractedContent);

    // Save to database
    const medicalReport = new MedicalReport({
      userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      extractedContent: extractedContent.substring(0, 5000),
      summary,
      reportType: classifyReportType(req.file.originalname),
      metrics,
    });

    await medicalReport.save();

    // Clean up file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      status: "success",
      message: "Medical report processed successfully",
      summary,
      metrics,
      reportId: medicalReport._id,
    });
  } catch (error) {
    console.error("Medical report processing error:", error);

    // Clean up file if exists
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // Also clean up req.file.path if different
    if (
      req.file &&
      req.file.path &&
      req.file.path !== filePath &&
      fs.existsSync(req.file.path)
    ) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: "Failed to process medical report",
      details: error.message,
    });
  }
};

const extractMetrics = (content) => {
  const metrics = {};

  // Enhanced metric extraction patterns
  const patterns = {
    glucose: /glucose\s*:?\s*(\d+\.?\d*)\s*mg\/dL/gi,
    cholesterol: /cholesterol\s*:?\s*(\d+\.?\d*)\s*mg\/dL/gi,
    hdl: /hdl\s*:?\s*(\d+\.?\d*)\s*mg\/dL/gi,
    ldl: /ldl\s*:?\s*(\d+\.?\d*)\s*mg\/dL/gi,
    bloodPressure: /blood\s*pressure\s*:?\s*(\d+\s*\/\s*\d+)\s*mmHg/gi,
    bmi: /bmi\s*:?\s*(\d+\.?\d*)/gi,
    weight: /weight\s*:?\s*(\d+\.?\d*)\s*kg/gi,
    height: /height\s*:?\s*(\d+\.?\d*)\s*cm/gi,
  };

  for (const [metric, pattern] of Object.entries(patterns)) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      metrics[metric] = matches[0][1];
    }
  }

  return metrics;
};

const classifyReportType = (filename) => {
  const lowerName = filename.toLowerCase();

  if (
    lowerName.includes("blood") ||
    lowerName.includes("cbc") ||
    lowerName.includes("lab")
  )
    return "Blood Test";
  if (
    lowerName.includes("imaging") ||
    lowerName.includes("scan") ||
    lowerName.includes("xray") ||
    lowerName.includes("mri") ||
    lowerName.includes("ct")
  )
    return "Imaging";
  if (lowerName.includes("genetic") || lowerName.includes("dna"))
    return "Genetic";
  if (
    lowerName.includes("cardio") ||
    lowerName.includes("heart") ||
    lowerName.includes("ecg") ||
    lowerName.includes("ekg")
  )
    return "Cardiac";
  if (lowerName.includes("urine") || lowerName.includes("urinalysis"))
    return "Urine Test";

  return "General Medical";
};

const getMedicalReports = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    const userId = req.user._id;

    const reports = await MedicalReport.find({ userId }).sort({
      uploadDate: -1,
    });

    res.json({
      status: "success",
      count: reports.length,
      reports: reports.map((r) => ({
        id: r._id,
        originalName: r.originalName,
        uploadDate: r.uploadDate,
        summary: r.summary,
        reportType: r.reportType,
        metrics: r.metrics,
      })),
    });
  } catch (error) {
    console.error("Get medical reports error:", error);
    res.status(500).json({
      error: "Failed to fetch medical reports",
    });
  }
};

// Add a test endpoint for PDF parsing
const testPdfParse = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded for test" });
    }

    filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    res.json({
      status: "success",
      textLength: pdfData.text.length,
      first500Chars: pdfData.text.substring(0, 500),
      info: pdfData.info,
    });
  } catch (error) {
    console.error("PDF test error:", error);
    res.status(500).json({
      error: "PDF test failed",
      details: error.message,
    });
  } finally {
    // Clean up file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export { uploadMedicalReport, getMedicalReports, testPdfParse };
