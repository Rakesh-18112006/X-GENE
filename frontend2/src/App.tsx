import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import MedicalReports from './pages/MedicalReports';
import Lifestyle from './pages/Lifestyle';
import Prevention from './pages/Prevention';
import DriftPatterns from './pages/DriftPatterns';
import ChatBot from './pages/ChatBot';
import Profile from './pages/Profile';
import DashboardLayout from './components/layout/DashboardLayout';

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/medical"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MedicalReports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lifestyle"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Lifestyle />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/prevention"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Prevention />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/drift"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DriftPatterns />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/chat"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ChatBot />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1c24',
            color: '#ffffff',
            border: '1px solid #2a2d3a',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#1a1c24',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff3366',
              secondary: '#1a1c24',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
