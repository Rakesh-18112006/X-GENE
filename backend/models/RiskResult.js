import mongoose from "mongoose";

const identifiedRiskSchema = new mongoose.Schema({
  risk_name: { type: String, required: true },
  probability: { type: String, required: true },
  reason: { type: String, required: true },
});

const riskResultSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // references the User model
      required: true,
    },
    identifiedRisks: [identifiedRiskSchema],
  },
  { timestamps: true }
);

export const RiskResult = mongoose.model("RiskResult", riskResultSchema);
