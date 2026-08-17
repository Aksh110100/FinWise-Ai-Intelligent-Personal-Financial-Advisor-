import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const MonthlyAISummary: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { monthlySummary } = dashboardData;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>YOUR MONTH IN MONEY</h3>
      
      <div style={cardStyle}>
        <div style={metricsGridStyle}>
          <SummaryMetric label="INCOME" value={monthlySummary.income} />
          <SummaryMetric label="EXPENSES" value={monthlySummary.expenses} />
          <SummaryMetric label="SAVED" value={monthlySummary.saved} />
          <SummaryMetric label="INVESTED" value={monthlySummary.invested} />
        </div>
        
        <div style={aiTextBlockStyle}>
          <p style={aiTextStyle}>"{monthlySummary.text}"</p>
        </div>

        <button style={reportBtnStyle} className="float-tag">VIEW FULL REPORT &rarr;</button>
      </div>
    </div>
  );
};

const SummaryMetric: React.FC<{label: string, value: string}> = ({ label, value }) => (
  <div style={metricStyle}>
    <span style={metricLabelStyle}>{label}</span>
    <span style={metricValueStyle}>{value}</span>
  </div>
);

const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.2rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: 0
};

const cardStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
  alignItems: 'flex-start'
};

const metricsGridStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3rem',
  width: '100%'
};

const metricStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const metricLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.05em'
};

const metricValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  color: 'var(--text-primary)'
};

const aiTextBlockStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'rgba(255,255,255,0.02)',
  borderLeft: '2px solid var(--accent-gold)',
  borderRadius: '0 8px 8px 0'
};

const aiTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1.1rem',
  color: 'var(--accent-gold)',
  margin: 0,
  fontStyle: 'italic',
  lineHeight: 1.5
};

const reportBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'var(--text-primary)',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  cursor: 'pointer'
};
