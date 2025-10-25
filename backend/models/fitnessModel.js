import mongoose from "mongoose";

const fitnessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
    },
    stepCount: {
      type: Number,
      default: 0,
    },
    glucoseLevel: {
      type: Number,
      default: 0,
    },
    bloodPressure: [
      {
        type: Number,
      },
    ],
    heartRate: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    heightInCms: {
      type: Number,
      default: 0,
    },
    sleepHours: {
      type: Number,
      default: 0,
    },
    bodyFatPercentage: {
      type: Number,
      default: 0,
    },
    menstrualCycleStart: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Fitness = mongoose.model("Fitness", fitnessSchema);
export default Fitness;
