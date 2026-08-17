import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const InvestmentSnapshot: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { investments } = dashboardData;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>INVESTMENTS</h3>
        <button style={planBtnStyle} className="chip">PLAN INVESTMENT &rarr;</button>
      </div>
      
      <div style={cardStyle}>
        <div style={topRowStyle}>
          <div style={metricStyle}>
            <span style={labelStyle}>CURRENT VALUE</span>
            <span style={valueStyle}>{investments.currentValue}</span>
          </div>
          <div style={{...metricStyle, alignItems: 'flex-end'}}>
            <span style={labelStyle}>GROWTH</span>
            <div style={growthGroupStyle}>
              <span style={{...valueStyle, color: 'var(--accent-emerald)'}}>{investments.growth}</span>
              <span style={percentageStyle}>{investments.growthPercentage}</span>
            </div>
          </div>
        </div>

        {/* Minimal trendline visual */}
        <div style={trendlineContainerStyle}>
          <svg viewBox="0 0 400 40" width="100%" height="100%" preserveAspectRatio="none">
             <path 
                d="M 0 30 Q 100 25 200 15 T 400 5" 
                fill="none" 
                stroke="var(--accent-emerald)" 
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(99, 181, 138, 0.2))' }}
             />
             <circle cx="400" cy="5" r="4" fill="var(--accent-emerald)" />
          </svg>
        </div>

        <div style={bottomRowStyle}>
          <span style={labelStyle}>TOTAL CONTRIBUTED</span>
          <span style={contributedValueStyle}>{investments.contributed}</span>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.2rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: 0
};

const planBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-primary)',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  cursor: 'pointer'
};

const cardStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const topRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
};

const metricStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.05em'
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2rem',
  color: 'var(--text-primary)'
};

const growthGroupStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.75rem'
};

const percentageStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--accent-emerald)',
  background: 'rgba(99, 181, 138, 0.1)',
  padding: '0.25rem 0.5rem',
  borderRadius: '4px'
};

const trendlineContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '40px',
  margin: '1rem 0'
};

const bottomRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '1rem',
  borderTop: '1px solid rgba(255,255,255,0.05)'
};

const contributedValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.1rem',
  color: 'var(--text-secondary)'
};
