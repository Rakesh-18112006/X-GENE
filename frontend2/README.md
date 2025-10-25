# AURA Health Frontend

A modern, beautiful health-tech frontend application built with React, TypeScript, and Vite.

## Features

- **Beautiful Dark Mode Design** - Modern health-tech aesthetic with smooth animations
- **Responsive Mobile Design** - Fully optimized for all device sizes
- **Authentication System** - Login and registration with JWT tokens
- **Health Dashboard** - Real-time health metrics visualization
- **Medical Reports** - Upload and manage medical documents
- **Lifestyle Tracking** - Monitor daily habits and receive recommendations
- **Prevention Plans** - AI-powered personalized health recommendations
- **Drift Pattern Analysis** - Track health metric changes over time
- **AI Chatbot** - Get health advice from AI assistant (placeholder)
- **Toast Notifications** - Beautiful feedback for all actions

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Recharts** - Beautiful data visualizations
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Modern icon library
- **TanStack Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Layout components (DashboardLayout)
│   └── ui/              # Reusable UI components (Button, Input, Card)
├── pages/               # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── Dashboard.tsx
│   ├── MedicalReports.tsx
│   ├── Lifestyle.tsx
│   ├── Prevention.tsx
│   ├── DriftPatterns.tsx
│   ├── ChatBot.tsx
│   └── Profile.tsx
├── services/            # API services
│   └── api.ts
├── hooks/               # Custom React hooks
│   └── useAuth.ts
├── types/               # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## API Integration

The frontend connects to the Node.js backend running on `http://localhost:5000/api`. All API calls are configured in `src/services/api.ts`.

### Available Endpoints

- **Auth**: `/api/v1/users/register`, `/api/v1/users/login`
- **Profile**: `/api/v1/users/profile`
- **Medical Reports**: `/api/medical/upload-medical-report`, `/api/medical/medical-reports`
- **Lifestyle**: `/api/lifestyle/analyze-lifestyle`, `/api/lifestyle/lifestyle-history/:userId`
- **Prevention**: `/api/prevention/personalized-prevention`
- **Drift Patterns**: `/api/drift/analyze-drift-patterns`, `/api/drift/drift-history/:userId`

## Design System

### Colors

- **Primary Accent**: `#00d9ff` (Cyan)
- **Success**: `#00ff88` (Green)
- **Warning**: `#ffaa00` (Orange)
- **Error**: `#ff3366` (Red)
- **Background**: `#0a0b0d` (Dark)
- **Surface**: `#13141a` (Slightly lighter)

### Typography

- **Font**: Inter (Google Fonts)
- **Headings**: Bold, 700 weight
- **Body**: Regular, 400 weight

### Animations

All animations are built with Framer Motion for smooth, performant transitions.

## Future Enhancements

- Connect AI chatbot to backend
- Add real-time notifications
- Implement data export features
- Add more health metrics
- Social features for health communities
