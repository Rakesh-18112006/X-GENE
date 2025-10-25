import { motion } from 'framer-motion';
import { Activity, Heart, TrendingUp, AlertCircle, FileText, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const healthData = [
    { date: 'Mon', heartRate: 72, steps: 8200, sleep: 7.2 },
    { date: 'Tue', heartRate: 68, steps: 9500, sleep: 7.8 },
    { date: 'Wed', heartRate: 75, steps: 7800, sleep: 6.5 },
    { date: 'Thu', heartRate: 71, steps: 10200, sleep: 8.1 },
    { date: 'Fri', heartRate: 69, steps: 11000, sleep: 7.5 },
    { date: 'Sat', heartRate: 73, steps: 6500, sleep: 8.5 },
    { date: 'Sun', heartRate: 70, steps: 8900, sleep: 8.0 },
  ];

  const stats = [
    {
      title: 'Heart Rate',
      value: '72 bpm',
      change: '+2.5%',
      trend: 'up',
      icon: Heart,
      color: '#00d9ff',
    },
    {
      title: 'Daily Steps',
      value: '8,900',
      change: '+12%',
      trend: 'up',
      icon: Activity,
      color: '#00ff88',
    },
    {
      title: 'Sleep Quality',
      value: '8.0 hrs',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: '#ffaa00',
    },
    {
      title: 'Health Score',
      value: '85/100',
      change: '-3%',
      trend: 'down',
      icon: AlertCircle,
      color: '#ff3366',
    },
  ];

  const recentActivity = [
    {
      title: 'Medical Report Uploaded',
      description: 'Blood test results analyzed',
      time: '2 hours ago',
      icon: FileText,
    },
    {
      title: 'Lifestyle Check Completed',
      description: 'Weekly assessment submitted',
      time: '1 day ago',
      icon: Heart,
    },
    {
      title: 'Prevention Plan Updated',
      description: 'New recommendations available',
      time: '2 days ago',
      icon: Activity,
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
          Welcome Back!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#a0a3bd] flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-[#00ff88]' : 'text-[#ff3366]'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-[#a0a3bd] text-sm mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h2 className="text-xl font-bold mb-6">Heart Rate Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="date" stroke="#a0a3bd" />
                <YAxis stroke="#a0a3bd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1c24',
                    border: '1px solid #2a2d3a',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  stroke="#00d9ff"
                  strokeWidth={3}
                  dot={{ fill: '#00d9ff', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h2 className="text-xl font-bold mb-6">Sleep Quality</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis dataKey="date" stroke="#a0a3bd" />
                <YAxis stroke="#a0a3bd" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1c24',
                    border: '1px solid #2a2d3a',
                    borderRadius: '8px',
                    color: '#ffffff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sleep"
                  stroke="#00ff88"
                  fill="#00ff8820"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-[#1a1c24] rounded-lg border border-[#2a2d3a] hover:border-[#00d9ff]/50 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-[#00d9ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#00d9ff]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{activity.title}</h3>
                    <p className="text-sm text-[#a0a3bd]">{activity.description}</p>
                  </div>
                  <span className="text-sm text-[#6b6f8a]">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card glass>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00d9ff]/20 to-[#0099ff]/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-[#00d9ff]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Health Tip of the Day</h3>
              <p className="text-[#a0a3bd]">
                Staying hydrated is crucial for maintaining optimal health. Aim for 8 glasses of water daily to support your body's vital functions.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
