import mongoose from "mongoose";

const lifestyleTrendSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercise: String,
  waterIntake: String,
  diet: String,
  habits: [String],
  sleepHours: Number,
  summary: {
    type: String,
    required: true,
  },
  metadata: {
    qualityScore: Number,
    riskFactors: [String],
  },
});

export default mongoose.model("LifestyleTrend", lifestyleTrendSchema);
