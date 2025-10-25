import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Moon, Coffee, Cigarette, Wine } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { lifestyleService } from '../services/api';
import toast from 'react-hot-toast';

export default function Lifestyle() {
  const [analyzing, setAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    sleepHours: '',
    exercise: '',
    diet: '',
    stress: '',
    smoking: false,
    alcohol: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    try {
      await lifestyleService.analyzeLifestyle({
        sleepHours: Number(formData.sleepHours),
        exercise: formData.exercise,
        diet: formData.diet,
        stress: formData.stress,
        smoking: formData.smoking,
        alcohol: formData.alcohol,
      });
      toast.success('Lifestyle analysis completed!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
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
          Track and optimize your daily habits for better health
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <h2 className="text-xl font-bold mb-6">Daily Check-in</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Moon className="w-4 h-4" />
                    Sleep Hours
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="7.5"
                    value={formData.sleepHours}
                    onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Activity className="w-4 h-4" />
                    Exercise Level
                  </label>
                  <select
                    value={formData.exercise}
                    onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg text-white focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
                    required
                  >
                    <option value="">Select level</option>
                    <option value="None">None</option>
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Intense">Intense</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Coffee className="w-4 h-4" />
                    Diet Quality
                  </label>
                  <select
                    value={formData.diet}
                    onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg text-white focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
                    required
                  >
                    <option value="">Select quality</option>
                    <option value="Poor">Poor</option>
                    <option value="Fair">Fair</option>
                    <option value="Good">Good</option>
                    <option value="Excellent">Excellent</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Heart className="w-4 h-4" />
                    Stress Level
                  </label>
                  <select
                    value={formData.stress}
                    onChange={(e) => setFormData({ ...formData, stress: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg text-white focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
                    required
                  >
                    <option value="">Select level</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-4 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg cursor-pointer hover:border-[#00d9ff]/50 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={formData.smoking}
                    onChange={(e) => setFormData({ ...formData, smoking: e.target.checked })}
                    className="w-5 h-5 rounded border-[#2a2d3a] bg-[#13141a] text-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20"
                  />
                  <Cigarette className="w-5 h-5 text-[#a0a3bd]" />
                  <span>Smoking</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg cursor-pointer hover:border-[#00d9ff]/50 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={formData.alcohol}
                    onChange={(e) => setFormData({ ...formData, alcohol: e.target.checked })}
                    className="w-5 h-5 rounded border-[#2a2d3a] bg-[#13141a] text-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20"
                  />
                  <Wine className="w-5 h-5 text-[#a0a3bd]" />
                  <span>Alcohol</span>
                </label>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={analyzing}>
                Analyze Lifestyle
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card>
            <h3 className="text-lg font-bold mb-4">Weekly Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#a0a3bd]">Sleep Avg</span>
                  <span className="font-medium">7.5 hrs</span>
                </div>
                <div className="h-2 bg-[#1a1c24] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#00d9ff] to-[#0099ff]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#a0a3bd]">Exercise</span>
                  <span className="font-medium">Moderate</span>
                </div>
                <div className="h-2 bg-[#1a1c24] rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-gradient-to-r from-[#00ff88] to-[#00cc66]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#a0a3bd]">Diet Quality</span>
                  <span className="font-medium">Good</span>
                </div>
                <div className="h-2 bg-[#1a1c24] rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-[#ffaa00] to-[#ff8800]" />
                </div>
              </div>
            </div>
          </Card>

          <Card glass>
            <h3 className="text-lg font-bold mb-4">Health Tips</h3>
            <ul className="space-y-3 text-sm text-[#a0a3bd]">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>Aim for 7-9 hours of quality sleep each night</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>Include 30 minutes of moderate exercise daily</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#00d9ff] rounded-full mt-2 flex-shrink-0" />
                <span>Stay hydrated with 8 glasses of water</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
