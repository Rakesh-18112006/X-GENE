import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  FileText,
  Heart,
  Shield,
  TrendingUp,
  MessageCircle,
  User,
  LogOut,
  Menu,
  X,
  FileArchiveIcon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/medical', icon: FileText, label: 'Medical Reports' },
    { path: '/dashboard/lifestyle', icon: Heart, label: 'Lifestyle' },
    { path: '/dashboard/prevention', icon: Shield, label: 'Prevention' },
    { path: '/dashboard/drift', icon: TrendingUp, label: 'Drift Patterns' },
    { path: '/dashboard/chat', icon: MessageCircle, label: 'AI Assistant' },
    { path: '/dashboard/upload', icon: FileArchiveIcon, label: 'Upload' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d]">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#13141a] border border-[#2a2d3a] rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-64 bg-[#13141a] border-r border-[#2a2d3a] z-40 flex flex-col"
          >
            <div className="p-6">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00d9ff] to-[#0099ff] rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">AURA Health</span>
              </Link>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-[#00d9ff]/10 text-[#00d9ff] border border-[#00d9ff]/30'
                        : 'text-[#a0a3bd] hover:bg-[#1a1c24] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-[#2a2d3a]">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00d9ff] to-[#0099ff] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-sm text-[#a0a3bd] truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-[#ff3366] hover:bg-[#ff3366]/10 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
