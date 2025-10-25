import { motion } from 'framer-motion';
import { Shield, Apple, Dumbbell, Pill, Heart, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';

export default function Prevention() {
  const preventionPlan = {
    dietary: [
      'Increase intake of leafy green vegetables',
      'Include omega-3 fatty acids from fish',
      'Reduce processed sugar consumption',
      'Add more fiber-rich foods to your diet',
    ],
    exercise: [
      '30 minutes of cardio 5 days a week',
      'Strength training 2-3 times per week',
      'Daily stretching and flexibility exercises',
      'Include outdoor activities for vitamin D',
    ],
    lifestyle: [
      'Maintain consistent sleep schedule',
      'Practice stress-reduction techniques',
      'Limit screen time before bed',
      'Stay socially connected',
    ],
    supplements: [
      'Vitamin D (2000 IU daily)',
      'Omega-3 (1000mg daily)',
      'Multivitamin (as directed)',
      'Probiotics for gut health',
    ],
  };

  const categories = [
    { key: 'dietary', title: 'Dietary Recommendations', icon: Apple, color: '#00ff88' },
    { key: 'exercise', title: 'Exercise Plan', icon: Dumbbell, color: '#00d9ff' },
    { key: 'lifestyle', title: 'Lifestyle Changes', icon: Heart, color: '#ffaa00' },
    { key: 'supplements', title: 'Supplements', icon: Pill, color: '#ff3366' },
  ];

  return (
    <div className="space-y-8">
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
              <h2 className="text-2xl font-bold">Your Personalized Prevention Plan</h2>
              <p className="text-[#a0a3bd]">Generated based on your health profile and goals</p>
            </div>
          </div>
          <div className="p-4 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-lg">
            <p className="text-sm">
              This plan is designed to help you maintain optimal health and prevent potential health issues.
              Follow these recommendations consistently for the best results.
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
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
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {preventionPlan[category.key as keyof typeof preventionPlan].map(
                    (item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 + itemIndex * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-[#1a1c24] rounded-lg border border-[#2a2d3a] hover:border-[#00d9ff]/30 transition-all duration-300"
                      >
                        <CheckCircle
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: category.color }}
                        />
                        <span className="text-[#a0a3bd]">{item}</span>
                      </motion.li>
                    )
                  )}
                </ul>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <h3 className="text-xl font-bold mb-4">Risk Factors Identified</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Sedentary Lifestyle', 'High Stress', 'Poor Sleep Quality'].map((risk, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="p-4 bg-[#ff3366]/10 border border-[#ff3366]/30 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#ff3366] rounded-full" />
                  <span className="font-medium text-[#ff3366]">Risk Factor</span>
                </div>
                <p className="text-sm">{risk}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
