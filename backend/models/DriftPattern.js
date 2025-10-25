import mongoose from "mongoose";

const driftPatternSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  analysisDate: {
    type: Date,
    default: Date.now,
  },
  healthBaseline: {
    description: String,
    parameters: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    stablePeriod: String,
  },
  earlyWarnings: [
    {
      parameter: String,
      currentTrend: String,
      deviation: String,
      riskLevel: String,
      recommendation: String,
    },
  ],
  visualizationParameters: {
    charts: [
      {
        type: String,
        dataPoints: [
          {
            date: Date,
            value: Number,
            metric: String,
          },
        ],
      },
    ],
    riskIndicators: [
      {
        indicator: String,
        status: String,
        trend: String,
      },
    ],
  },
  overallRiskAssessment: {
    level: String,
    trend: String,
    confidence: Number,
  },
  recommendations: [String],
});

export default mongoose.model("DriftPattern", driftPatternSchema);
