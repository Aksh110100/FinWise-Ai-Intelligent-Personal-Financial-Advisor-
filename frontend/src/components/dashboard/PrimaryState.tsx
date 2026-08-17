import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const PrimaryState: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { overview } = dashboardData;

  return (
    <div style={containerStyle}>
      <div style={mainBalanceStyle}>
        <div style={balanceLabelStyle}>TOTAL BALANCE</div>
        <div style={balanceValueStyle}>{overview.currentBalance}</div>
        <div style={balanceTrendStyle}>{overview.balanceTrend} this month</div>
      </div>

      <div style={metricsGridStyle}>
        <MetricCard label="INCOME" value={overview.monthlyIncome} />
        <MetricCard label="EXPENSES" value={overview.monthlyExpenses} />
        <MetricCard label="SAVINGS" value={overview.monthlySaved} />
        <MetricCard label="INVESTMENTS" value={overview.monthlyInvested} />
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={metricCardStyle}>
    <div style={metricLabelStyle}>{label}</div>
    <div style={metricValueStyle}>{value}</div>
  </div>
);

const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '3rem'
};

const mainBalanceStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const balanceLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase'
};

const balanceValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '4.5rem',
  fontWeight: 400,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  lineHeight: 1,
  background: 'var(--grad-text)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const balanceTrendStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-positive)',
  marginTop: '0.25rem'
};

const metricsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.5rem',
};

const metricCardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '1.5rem',
  background: 'rgba(255, 255, 255, 0.015)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase'
};

const metricValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.75rem',
  color: 'var(--text-primary)'
};
