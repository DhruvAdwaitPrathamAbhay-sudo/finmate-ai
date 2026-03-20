import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';
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

function ProtectedLayout() {
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  const path = window.location.pathname;
  const title = PAGE_TITLES[path] || 'ChartLine FinMate AI';

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} title={title} />
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/charts" element={<ChartsPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
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
