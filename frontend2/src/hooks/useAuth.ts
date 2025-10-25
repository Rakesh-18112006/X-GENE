import { useState, useEffect } from 'react';
import { authService } from '../services/api';
import type { User } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Welcome back!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data);
      toast.success('Account created successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return { user, loading, login, register, logout, loadUser };
};
