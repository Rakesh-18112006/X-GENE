import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, Heart, Shield, TrendingUp, Users } from 'lucide-react';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'Real-time Health Monitoring',
      description: 'Track your health metrics in real-time with advanced analytics and insights.'
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Get personalized health recommendations powered by cutting-edge AI technology.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Lifestyle Optimization',
      description: 'Optimize your daily habits with data-driven lifestyle recommendations.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Disease Prevention',
      description: 'Stay ahead with proactive prevention strategies tailored to your health profile.'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Drift Pattern Detection',
      description: 'Detect health trends and patterns before they become critical.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Support',
      description: 'Get guidance from healthcare professionals through our AI assistant.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0d] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#00d9ff]/10 via-transparent to-transparent" />

      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#00d9ff] to-[#0099ff] rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">AURA Health</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="primary" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>

      <section className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            {...fadeInUp}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded-full text-[#00d9ff] text-sm font-medium mb-8">
              The Future of Healthcare
            </span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Your Health,{' '}
            <span className="gradient-text">Amplified</span>
          </motion.h1>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-[#a0a3bd] mb-12 leading-relaxed"
          >
            Experience next-generation health monitoring with AI-powered insights,
            personalized prevention plans, and real-time drift pattern detection.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/dashboard')}
            >
              View Demo
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-transparent z-10" />
          <div className="glass-effect rounded-2xl p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="bg-[#1a1c24] rounded-xl p-6 border border-[#2a2d3a]"
                >
                  <div className="h-32 bg-gradient-to-br from-[#00d9ff]/20 to-[#0099ff]/20 rounded-lg mb-4 flex items-center justify-center">
                    <Activity className="w-12 h-12 text-[#00d9ff] animate-pulse-slow" />
                  </div>
                  <div className="h-4 bg-[#2a2d3a] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#2a2d3a] rounded w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-xl text-[#a0a3bd]">
            Everything you need to take control of your health
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="glass-effect p-8 rounded-2xl border border-[#2a2d3a] hover:border-[#00d9ff]/50 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#00d9ff]/20 to-[#0099ff]/20 rounded-xl flex items-center justify-center mb-6 text-[#00d9ff]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#a0a3bd] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00d9ff]/10 via-transparent to-[#0099ff]/10" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-[#a0a3bd] mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the future of healthcare
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 container mx-auto px-6 py-8 border-t border-[#2a2d3a]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00d9ff]" />
            <span className="text-[#a0a3bd]">© 2025 AURA Health. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-[#a0a3bd]">
            <a href="#" className="hover:text-[#00d9ff] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#00d9ff] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#00d9ff] transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00d9ff] rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
