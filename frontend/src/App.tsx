import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import Expenses from './pages/dashboard/Expenses';
import Budget from './pages/dashboard/Budget';
import Savings from './pages/dashboard/Savings';
import Investments from './pages/dashboard/Investments';
import Goals from './pages/dashboard/Goals';
import Reports from './pages/dashboard/Reports';
import { AIAdvisorPage } from './pages/dashboard/AIAdvisorPage';
import { ProfileSettingsPage } from './pages/dashboard/ProfileSettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<AuthPage />} />
        
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/advisor" element={<AIAdvisorPage />} />
          <Route path="/settings" element={<ProfileSettingsPage />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        
        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
