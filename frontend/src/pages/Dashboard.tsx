import React, { useEffect, useState } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';

// Components
import { FloatingNav } from '../components/dashboard/FloatingNav';
import { QuickActions } from '../components/dashboard/QuickActions';

// New Command Center Components
import { CommandCenterHeader } from '../components/dashboard/CommandCenterHeader';
import { PrimaryState } from '../components/dashboard/PrimaryState';
import { SafeToSpend } from '../components/dashboard/SafeToSpend';
import { IncomeExpenseGraph } from '../components/dashboard/IncomeExpenseGraph';
import { RadialFinancialHealth } from '../components/dashboard/RadialFinancialHealth';
import { EditorialObservation } from '../components/dashboard/EditorialObservation';
import { SpendingSnapshot } from '../components/dashboard/SpendingSnapshot';
import { FutureForecast } from '../components/dashboard/FutureForecast';
import { UpcomingMoney } from '../components/dashboard/UpcomingMoney';
import { GoalTimeline } from '../components/dashboard/GoalTimeline';
import { InvestmentSnapshot } from '../components/dashboard/InvestmentSnapshot';
import { AISavingOpportunities } from '../components/dashboard/AISavingOpportunities';
import { FinancialImportCenter } from '../components/dashboard/FinancialImportCenter';
import { WhatIfSimulator } from '../components/dashboard/WhatIfSimulator';
import { MonthlyAISummary } from '../components/dashboard/MonthlyAISummary';

import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);

    const userData = localStorage.getItem('finwise_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || mockDashboardData.user.firstName);
      } catch (e) {
        setUserName(mockDashboardData.user.firstName);
      }
    } else {
      setUserName(mockDashboardData.user.firstName);
    }
  }, []);

  return (
    <div style={pageStyle}>
      {/* Ambient Cinematic Background */}
      <div className="dashboard-ambient-bg">
        <img src="/financial-frames/frame_000100.jpg" alt="" className="dashboard-ambient-img" />
      </div>

      <FloatingNav />
      
      <div style={contentContainerStyle}>
        <CommandCenterHeader />
        <PrimaryState />
        <SafeToSpend />
        <IncomeExpenseGraph />
        <RadialFinancialHealth />
        <EditorialObservation />
        <SpendingSnapshot />
        <FutureForecast />
        <UpcomingMoney />
        <GoalTimeline />
        <InvestmentSnapshot />
        <AISavingOpportunities />
        <FinancialImportCenter />
        <WhatIfSimulator />
        <MonthlyAISummary />
        <QuickActions />
      </div>
    </div>
  );
};

// Styles
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#050505',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-secondary)',
  position: 'relative',
};

const contentContainerStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: '900px', // Restricting max width to keep it looking good on desktop
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: '6rem'
};

export default Dashboard;
