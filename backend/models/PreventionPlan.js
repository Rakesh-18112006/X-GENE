import mongoose from "mongoose";

const preventionPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // store user reference properly
      ref: "User",
      required: true,
    },
    disease: {
      type: String,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["low", "moderate", "high"],
      required: true,
    },

    // ✅ structured diet plan
    dietPlan: {
      breakfast: { type: String },
      lunch: { type: String },
      dinner: { type: String },
    },

    // ✅ structured medication and monitoring info
    medicationAndMonitoring: {
      recommendedMeds: [{ type: String }],
      monitoringSchedule: {
        tests: [{ type: String }],
        frequency: { type: String },
      },
    },

    // ✅ lifestyle recommendations
    lifestylePlan: {
      exercise: { type: String },
      sleep: { type: String },
      stressManagement: { type: String },
      avoidHabits: [{ type: String }],
    },

    clinicalGuidelinesReference: {
      type: String,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PreventionPlan", preventionPlanSchema);
