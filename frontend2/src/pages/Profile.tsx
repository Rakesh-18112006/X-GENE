import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    gender: user?.gender || '',
    phone: user?.phone || '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setSaving(false);
    }, 1000);
  };

  const stats = [
    { label: 'Reports Uploaded', value: '12' },
    { label: 'Days Active', value: '45' },
    { label: 'Health Score', value: '85' },
    { label: 'Streak', value: '7 days' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Profile Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#a0a3bd]"
        >
          Manage your account and preferences
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-[#00d9ff] to-[#0099ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.name || 'User'}</h2>
              <p className="text-[#a0a3bd]">{user?.email}</p>
            </div>

            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-[#1a1c24] rounded-lg border border-[#2a2d3a]"
                >
                  <span className="text-[#a0a3bd] text-sm">{stat.label}</span>
                  <span className="font-bold">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <Calendar className="w-4 h-4" />
                    Age
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Enter your age"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                    <User className="w-4 h-4" />
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1c24] border border-[#2a2d3a] rounded-lg text-white focus:border-[#00d9ff] focus:ring-2 focus:ring-[#00d9ff]/20 transition-all duration-300"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-[#a0a3bd] mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={saving}
              >
                <Save className="w-5 h-5" />
                Save Changes
              </Button>
            </form>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <Card glass>
              <h3 className="text-lg font-bold mb-4">Account Security</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-[#1a1c24] hover:bg-[#20222d] border border-[#2a2d3a] hover:border-[#00d9ff]/50 rounded-lg transition-all duration-300">
                  <div className="font-medium mb-1">Change Password</div>
                  <div className="text-sm text-[#a0a3bd]">Update your password regularly</div>
                </button>
                <button className="w-full text-left p-4 bg-[#1a1c24] hover:bg-[#20222d] border border-[#2a2d3a] hover:border-[#00d9ff]/50 rounded-lg transition-all duration-300">
                  <div className="font-medium mb-1">Two-Factor Authentication</div>
                  <div className="text-sm text-[#a0a3bd]">Add an extra layer of security</div>
                </button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
