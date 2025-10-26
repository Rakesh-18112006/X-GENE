import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Apple,
  Dumbbell,
  Pill,
  Heart,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Card from "../components/ui/Card";
import { preventionService } from "../services/api";
import toast from "react-hot-toast";

interface PreventionPlan {
  disease: string;
  risk_score: number;
  risk_level: string;
  diet_plan: {
    nutritional_goals: string[];
    weekly_meal_structure: {
      [key: string]: { breakfast: string; lunch: string; dinner: string };
    };
    foods_to_include: string[];
    foods_to_avoid: string[];
  };
  medication_and_monitoring: {
    preventive_medications: string[];
    supplements: string[];
    screening_schedule: {
      tests: string[];
      frequency: string;
    };
    biomarker_targets: {
      key_metrics: string[];
      target_ranges: string;
    };
  };
  lifestyle_plan: {
    exercise_regimen: {
      aerobic: string;
      strength: string;
      frequency: string;
    };
    sleep_optimization: {
      duration: string;
      quality_measures: string;
    };
    stress_management: {
      techniques: string[];
      frequency: string;
    };
    substance_avoidance: string[];
    environmental_factors: string[];
  };
  risk_reduction_targets: {
    short_term_goals: string[];
    long_term_goals: string[];
    success_metrics: string[];
  };
  clinical_guidelines_reference: string;
}

export default function Prevention() {
  const [preventionPlan, setPreventionPlan] = useState<PreventionPlan | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      key: "diet",
      title: "Dietary Recommendations",
      icon: Apple,
      color: "#00ff88",
      getData: (plan: PreventionPlan) => [
        ...plan.diet_plan.nutritional_goals,
        ...plan.diet_plan.foods_to_include,
      ],
    },
    {
      key: "exercise",
      title: "Exercise Plan",
      icon: Dumbbell,
      color: "#00d9ff",
      getData: (plan: PreventionPlan) => [
        `Aerobic: ${plan.lifestyle_plan.exercise_regimen.aerobic}`,
        `Strength: ${plan.lifestyle_plan.exercise_regimen.strength}`,
        `Frequency: ${plan.lifestyle_plan.exercise_regimen.frequency}`,
      ],
    },
    {
      key: "lifestyle",
      title: "Lifestyle Changes",
      icon: Heart,
      color: "#ffaa00",
      getData: (plan: PreventionPlan) => [
        `Sleep: ${plan.lifestyle_plan.sleep_optimization.duration}`,
        ...plan.lifestyle_plan.stress_management.techniques,
        ...plan.lifestyle_plan.environmental_factors,
      ],
    },
    {
      key: "supplements",
      title: "Supplements & Medications",
      icon: Pill,
      color: "#ff3366",
      getData: (plan: PreventionPlan) => [
        ...plan.medication_and_monitoring.preventive_medications,
        ...plan.medication_and_monitoring.supplements,
      ],
    },
  ];

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await preventionService.getPlan();
        setPreventionPlan(data);
      } catch (err: any) {
        toast.error("Failed to load prevention plan. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-[#a0a3bd] text-lg">
        Loading your personalized prevention plan...
      </div>
    );
  }

  if (!preventionPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center text-[#a0a3bd] space-y-4">
        <AlertTriangle className="w-10 h-10 text-yellow-500" />
        <p className="text-lg">No prevention plan data available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Prevention Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#a0a3bd]"
        >
          Personalized recommendations for optimal health
        </motion.p>
      </div>

      {/* Intro Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card glass>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00d9ff]/20 to-[#0099ff]/20 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#00d9ff]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                Your Personalized Prevention Plan
              </h2>
              <p className="text-[#a0a3bd]">
                Generated based on your lifestyle, health data, and medical
                insights
              </p>
            </div>
          </div>
          <div className="p-4 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-lg">
            <p className="text-sm">
              Follow these science-backed recommendations to reduce risk and
              improve long-term health. Each plan is tailored specifically to
              your personal wellness profile.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const items = category.getData(preventionPlan);

          if (!items || items.length === 0) return null;

          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card hover>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: category.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {items.map((item: string, itemIndex: number) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + index * 0.1 + itemIndex * 0.05,
                      }}
                      className="flex items-start gap-3 p-3 bg-[#1a1c24] rounded-lg border border-[#2a2d3a] hover:border-[#00d9ff]/30 transition-all duration-300"
                    >
                      <CheckCircle
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: category.color }}
                      />
                      <span className="text-[#a0a3bd]">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Risk Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <h3 className="text-xl font-bold mb-4">Risk Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#ff3366] rounded-full" />
                <span className="font-medium text-[#ff3366]">Risk Level</span>
              </div>
              <p className="text-xl font-bold">{preventionPlan.risk_level}</p>
              <p className="text-sm text-[#a0a3bd] mt-1">
                Risk Score: {preventionPlan.risk_score}
              </p>
            </div>
            <div className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#ff3366] rounded-full" />
                <span className="font-medium text-[#ff3366]">
                  Disease Focus
                </span>
              </div>
              <p className="text-xl font-bold">{preventionPlan.disease}</p>
              <p className="text-sm text-[#a0a3bd] mt-1">
                Targeted Prevention Plan
              </p>
            </div>
          </div>

          <h4 className="text-lg font-bold mb-4">Short Term Goals</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {preventionPlan.risk_reduction_targets.short_term_goals.map(
              (goal: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-[#ff3366] rounded-full" />
                    <span className="font-medium text-[#ff3366]">
                      Goal {index + 1}
                    </span>
                  </div>
                  <p className="text-sm">{goal}</p>
                </motion.div>
              )
            )}
          </div>

          <h4 className="text-lg font-bold mb-4">Long Term Goals</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preventionPlan.risk_reduction_targets.long_term_goals.map(
              (goal: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-violet-500 rounded-full" />
                    <span className="font-medium text-violet-500">
                      Goal {index + 1}
                    </span>
                  </div>
                  <p className="text-sm">{goal}</p>
                </motion.div>
              )
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
