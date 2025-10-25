import axios from 'axios';
import type { AuthResponse, User, MedicalReport, LifestyleTrend, PreventionPlan, DriftPattern } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/v1/users/register', { name, email, password });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/v1/users/login', { email, password });
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/v1/users/profile');
    return data;
  },

  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const { data } = await api.post('/v1/users/profile', profileData);
    return data;
  },
};

export const medicalService = {
  uploadReport: async (file: File): Promise<MedicalReport> => {
    const formData = new FormData();
    formData.append('medicalReport', file);
    const { data } = await api.post('/medical/upload-medical-report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  getReports: async (): Promise<MedicalReport[]> => {
    const { data } = await api.get('/medical/medical-reports');
    return data;
  },
};

export const lifestyleService = {
  analyzeLifestyle: async (lifestyleData: {
    sleepHours: number;
    exercise: string;
    diet: string;
    stress: string;
    smoking: boolean;
    alcohol: boolean;
  }): Promise<LifestyleTrend> => {
    const { data } = await api.post('/lifestyle/analyze-lifestyle', lifestyleData);
    return data;
  },

  getHistory: async (userId: string): Promise<LifestyleTrend[]> => {
    const { data } = await api.get(`/lifestyle/lifestyle-history/${userId}`);
    return data;
  },
};

export const preventionService = {
  getPlan: async (): Promise<PreventionPlan> => {
    const { data } = await api.get('/prevention/personalized-prevention');
    return data;
  },
};

export const driftService = {
  analyzeDrift: async (metrics: {
    weight?: number;
    bloodPressure?: string;
    heartRate?: number;
    sleepQuality?: number;
  }): Promise<DriftPattern> => {
    const { data } = await api.post('/drift/analyze-drift-patterns', { metrics });
    return data;
  },

  getHistory: async (userId: string): Promise<DriftPattern[]> => {
    const { data } = await api.get(`/drift/drift-history/${userId}`);
    return data;
  },
};

export default api;
