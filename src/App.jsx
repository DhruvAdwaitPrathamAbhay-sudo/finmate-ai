import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
import ParallaxBackground from './components/ui/ParallaxBackground';
import ScrollProgress from './components/ui/ScrollProgress';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import ChartsPage from './pages/ChartsPage';
import ChatbotPage from './pages/ChatbotPage';
import InsightsPage from './pages/InsightsPage';
import PredictionsPage from './pages/PredictionsPage';
import GoalsPage from './pages/GoalsPage';
import {
   ChartLine // feature icons
} from 'lucide-react';
const PAGE_TITLES = {
  '/dashboard': '🏠 Dashboard',
  '/expenses': '💸 Expense Tracker',
  '/charts': '📊 Charts & Analytics',
  '/chatbot': '🤖 AI Assistant',
  '/insights': '💡 Smart Insights',
  '/predictions': '🔮 Predictions',
  '/goals': '🎯 Savings Goals',
};

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: -10 },
};

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

function ProtectedLayout() {
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!user) return <Navigate to="/" replace />;

  const path = location.pathname;
  const title = PAGE_TITLES[path] || '💎 FinMate AI';

  return (
    <div className="app-layout">
      <ParallaxBackground />
      <ScrollProgress />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} title={title} />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/dashboard" element={<AnimatedPage><DashboardPage /></AnimatedPage>} />
            <Route path="/expenses" element={<AnimatedPage><ExpensesPage /></AnimatedPage>} />
            <Route path="/charts" element={<AnimatedPage><ChartsPage /></AnimatedPage>} />
            <Route path="/chatbot" element={<AnimatedPage><ChatbotPage /></AnimatedPage>} />
            <Route path="/insights" element={<AnimatedPage><InsightsPage /></AnimatedPage>} />
            <Route path="/predictions" element={<AnimatedPage><PredictionsPage /></AnimatedPage>} />
            <Route path="/goals" element={<AnimatedPage><GoalsPage /></AnimatedPage>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
        <footer className="disclaimer">
          <strong>⚠️ Disclaimer:</strong> FinMate AI provides financial insights for educational purposes only. Always consult a certified financial advisor before making investment decisions.
        </footer>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
