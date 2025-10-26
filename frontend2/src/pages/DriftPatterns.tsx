import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Activity } from "lucide-react";
import Card from "../components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DriftPatterns() {
  const driftData = [
    { date: "Week 1", weight: 75, heartRate: 72, bloodPressure: 120 },
    { date: "Week 2", weight: 74.5, heartRate: 70, bloodPressure: 118 },
    { date: "Week 3", weight: 74.8, heartRate: 73, bloodPressure: 122 },
    { date: "Week 4", weight: 75.2, heartRate: 75, bloodPressure: 125 },
    { date: "Week 5", weight: 75.5, heartRate: 78, bloodPressure: 128 },
    { date: "Week 6", weight: 76, heartRate: 80, bloodPressure: 130 },
  ];

  const detectedDrifts = [
    {
      metric: "Heart Rate",
      status: "warning",
      change: "+11%",
      description: "Gradual increase detected over the past 6 weeks",
      recommendation:
        "Consider increasing cardiovascular exercise and stress management",
    },
    {
      metric: "Blood Pressure",
      status: "alert",
      change: "+8.3%",
      description: "Upward trend in systolic blood pressure",
      recommendation:
        "Monitor sodium intake and consult with healthcare provider",
    },
    {
      metric: "Weight",
      status: "normal",
      change: "+1.3%",
      description: "Minor fluctuations within normal range",
      recommendation: "Continue current diet and exercise routine",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Drift Pattern Analysis
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#a0a3bd]"
        >
          Track changes in your health metrics over time
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card glass>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#ffaa00]/20 to-[#ff8800]/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-[#ffaa00]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Drift Detection Active</h2>
              <p className="text-[#a0a3bd]">
                Monitoring your health metrics for significant changes
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h2 className="text-xl font-bold mb-6">Health Metrics Trends</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={driftData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
              <XAxis dataKey="date" stroke="#a0a3bd" />
              <YAxis stroke="#a0a3bd" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1c24",
                  border: "1px solid #2a2d3a",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#ff3366"
                strokeWidth={3}
                name="Heart Rate"
                dot={{ fill: "#ff3366", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bloodPressure"
                stroke="#ffaa00"
                strokeWidth={3}
                name="Blood Pressure"
                dot={{ fill: "#ffaa00", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#00d9ff"
                strokeWidth={3}
                name="Weight (kg)"
                dot={{ fill: "#00d9ff", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Detected Drift Patterns</h2>
        {detectedDrifts.map((drift, index) => {
          const statusColors = {
            alert: { bg: "#ff3366", text: "#ff3366" },
            warning: { bg: "#ffaa00", text: "#ffaa00" },
            normal: { bg: "#00ff88", text: "#00ff88" },
          };
          const color = statusColors[drift.status as keyof typeof statusColors];
          const Icon =
            drift.status === "alert"
              ? TrendingUp
              : drift.status === "warning"
              ? TrendingUp
              : Activity;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color.bg}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: color.text }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold">{drift.metric}</h3>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: `${color.bg}20`,
                          color: color.text,
                        }}
                      >
                        {drift.change}
                      </span>
                    </div>
                    <p className="text-[#a0a3bd] mb-3">{drift.description}</p>
                    <div className="p-3 bg-[#1a1c24] rounded-lg border border-[#2a2d3a]">
                      <p className="text-sm">
                        <span className="font-medium text-white">
                          Recommendation:
                        </span>{" "}
                        {drift.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
