import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Activity,
  Moon,
  Coffee,
  Droplet,
  ListChecks,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { lifestyleService } from "../services/api";
import toast from "react-hot-toast";

export default function Lifestyle() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    exercise: "",
    waterIntake: "",
    diet: "",
    habits: "",
    sleepHours: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      const habitsArray = formData.habits
        .split(",")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const response = await lifestyleService.analyzeLifestyle({
        exercise: formData.exercise,
        waterIntake: formData.waterIntake,
        diet: formData.diet,
        habits: habitsArray,
        sleepHours: Number(formData.sleepHours),
      });

      setResult(response);
      toast.success("Lifestyle analysis completed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-2"
      >
        Lifestyle Analysis
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[#a0a3bd]"
      >
        Understand your lifestyle and get personalized improvement insights
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <h2 className="text-xl font-bold mb-6">Enter Lifestyle Data</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Activity className="w-4 h-4" /> Exercise
                  </label>
                  <Input
                    type="text"
                    placeholder="30 mins jogging"
                    value={formData.exercise}
                    onChange={(e) =>
                      setFormData({ ...formData, exercise: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Droplet className="w-4 h-4" /> Water Intake
                  </label>
                  <Input
                    type="text"
                    placeholder="2.5L"
                    value={formData.waterIntake}
                    onChange={(e) =>
                      setFormData({ ...formData, waterIntake: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                  <Coffee className="w-4 h-4" /> Diet
                </label>
                <Input
                  type="text"
                  placeholder="Vegetarian with moderate sugar"
                  value={formData.diet}
                  onChange={(e) =>
                    setFormData({ ...formData, diet: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                  <ListChecks className="w-4 h-4" /> Habits
                </label>
                <Input
                  type="text"
                  placeholder="No smoking, Occasional alcohol"
                  value={formData.habits}
                  onChange={(e) =>
                    setFormData({ ...formData, habits: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                  <Moon className="w-4 h-4" /> Sleep Hours
                </label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="7.5"
                  value={formData.sleepHours}
                  onChange={(e) =>
                    setFormData({ ...formData, sleepHours: e.target.value })
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={analyzing}
              >
                Analyze Lifestyle
              </Button>
            </form>
          </Card>

          {result && (
            <Card className="mt-6">
              <h3 className="text-xl font-bold mb-3">Analysis Summary</h3>
              <p className="text-[#a0a3bd] whitespace-pre-line">
                {result.summary}
              </p>
              <div className="mt-4 text-sm">
                <p>
                  <strong>Quality Score:</strong>{" "}
                  {(result.qualityScore * 100).toFixed(0)}%
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(result.date).toLocaleString()}
                </p>
              </div>
            </Card>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card glass>
            <h3 className="text-lg font-bold mb-4">Health Tips</h3>
            <ul className="space-y-3 text-sm text-[#a0a3bd]">
              <li>💧 Stay hydrated (2–3L/day)</li>
              <li>🛌 Sleep 7–8 hours every night</li>
              <li>🥗 Eat balanced meals low in sugar</li>
              <li>🏃‍♂️ Exercise regularly (30 mins/day)</li>
              <li>😌 Manage stress with relaxation or meditation</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
