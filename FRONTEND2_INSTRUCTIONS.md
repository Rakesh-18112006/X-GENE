# Frontend2 - AURA Health Frontend

## Overview

A beautiful, modern health-tech frontend built with React, TypeScript, and Vite. Features dark mode design, smooth animations, mobile responsiveness, and complete integration with the Node.js backend.

## Quick Start

### 1. Install Dependencies

```bash
cd frontend2
npm install
```

### 2. Start Backend First

Make sure your Node.js backend is running on port 5000:

```bash
cd backend
npm start
```

### 3. Start Frontend

```bash
cd frontend2
npm run dev
```

The app will open automatically at `http://localhost:3000`

## Features Implemented

✅ **Landing Page** - Beautiful animated landing page with feature showcase
✅ **Authentication** - Login and registration pages with toast notifications
✅ **Dashboard** - Health metrics overview with charts and statistics
✅ **Medical Reports** - Upload and manage PDF medical reports
✅ **Lifestyle Tracking** - Daily check-ins with habit tracking
✅ **Prevention Plans** - Personalized health recommendations
✅ **Drift Pattern Analysis** - Track health metric changes over time
✅ **AI Chatbot** - Placeholder chatbot interface (ready for backend integration)
✅ **Profile Management** - User profile settings and statistics
✅ **Toast Notifications** - Beautiful feedback for all actions
✅ **Dark Mode** - Modern dark theme throughout
✅ **Animations** - Smooth Framer Motion animations everywhere
✅ **Mobile Responsive** - Fully responsive design for all screen sizes

## Design System

### Color Palette

- **Accent Primary**: #00d9ff (Cyan) - Used for primary actions and highlights
- **Success**: #00ff88 (Green) - Positive feedback and success states
- **Warning**: #ffaa00 (Orange) - Warnings and cautions
- **Error**: #ff3366 (Red) - Errors and destructive actions
- **Background**: #0a0b0d - Main background
- **Surface**: #13141a - Card backgrounds
- **Border**: #2a2d3a - Borders and dividers

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: 700 weight, 120% line height
- **Body**: 400 weight, 150% line height

## Key Pages

### Public Pages

- `/` - Landing page with feature showcase
- `/login` - User login
- `/register` - New user registration

### Protected Pages (Require Login)

- `/dashboard` - Main dashboard with health overview
- `/dashboard/medical` - Medical report management
- `/dashboard/lifestyle` - Lifestyle tracking and analysis
- `/dashboard/prevention` - Prevention plan viewer
- `/dashboard/drift` - Drift pattern analytics
- `/dashboard/chat` - AI health assistant (placeholder)
- `/dashboard/profile` - User profile and settings

## API Integration

All API calls are handled through `src/services/api.ts` and connect to:
- Base URL: `http://localhost:5000/api`
- Authentication: JWT token stored in localStorage
- Automatic token injection in request headers

## Component Structure

### Reusable UI Components

- `Button` - Styled button with variants (primary, secondary, outline, ghost)
- `Input` - Text input with label and error handling
- `Card` - Container card with hover effects and glass option

### Layout Components

- `DashboardLayout` - Main layout with sidebar navigation

### Pages

All page components in `src/pages/` are fully functional and connected to the API.

## Technologies

- React 18 with TypeScript
- Vite for fast development
- Framer Motion for animations
- React Router for routing
- Recharts for data visualization
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons
- TanStack Query for data fetching

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Next Steps

1. Connect the AI chatbot to your backend or AI service
2. Implement real-time notifications using WebSockets
3. Add more health metrics and visualizations
4. Implement data export features
5. Add user preferences and settings

## Notes

- The frontend is fully mobile responsive
- All animations use Framer Motion for smooth performance
- Toast notifications appear for all important actions
- Protected routes automatically redirect to login if not authenticated
- The design follows modern health-tech aesthetics with attention to detail
