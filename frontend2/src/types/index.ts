export interface User {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  phone?: string;
  token?: string;
}

export interface Risk {
  risk_name: string;
  probability: string;
  reason: string;
}

export interface UploadResponse {
  message: string;
  user: string;
  identifiedRisks: Risk[];
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface MedicalReport {
  _id: string;
  userId: string;
  fileName: string;
  filePath: string;
  uploadDate: string;
  analysis?: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
  };
}

export interface LifestyleTrend {
  _id: string;
  userId: string;
  date: string;
  sleepHours: number;
  exercise: string;
  diet: string;
  stress: string;
  smoking: boolean;
  alcohol: boolean;
  analysis?: {
    riskLevel: string;
    suggestions: string[];
  };
}

export interface PreventionPlan {
  _id: string;
  userId: string;
  generatedAt: string;
  recommendations: {
    dietary: string[];
    exercise: string[];
    lifestyle: string[];
    supplements: string[];
  };
  riskFactors: string[];
}

export interface DriftPattern {
  _id: string;
  userId: string;
  date: string;
  metrics: {
    weight?: number;
    bloodPressure?: string;
    heartRate?: number;
    sleepQuality?: number;
  };
  drift: {
    detected: boolean;
    severity?: string;
    affectedMetrics?: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
