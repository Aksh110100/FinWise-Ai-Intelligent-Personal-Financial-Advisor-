import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const CommandCenterHeader: React.FC = () => {
  const { dashboardData } = useDashboard();
  
  return (
    <div style={headerStyle}>
      <h1 style={greetingStyle}>
        GOOD EVENING, {dashboardData.user.firstName.toUpperCase()}.
      </h1>
      <h2 style={subtitleStyle}>
        YOUR MONEY, AT A GLANCE.
      </h2>
      <p style={aiStatementStyle}>
        {dashboardData.health.summary}
      </p>
    </div>
  );
};

const headerStyle: React.CSSProperties = {
  marginBottom: '3rem',
  padding: '0 2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '2rem'
};

const greetingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2rem',
  fontWeight: 400,
  letterSpacing: '0.02em',
  color: 'var(--text-primary)',
  textTransform: 'uppercase',
  margin: 0
};

const subtitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  fontWeight: 400,
  letterSpacing: '0.04em',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  margin: 0
};

const aiStatementStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-positive)',
  marginTop: '1rem',
  opacity: 0.9
};
