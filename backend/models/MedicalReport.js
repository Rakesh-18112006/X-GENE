import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  filename: String,
  originalName: String,
  filePath: String,
  extractedContent: String,
  summary: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  reportType: String,
  metrics: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
});

export default mongoose.model("MedicalReport", medicalReportSchema);
