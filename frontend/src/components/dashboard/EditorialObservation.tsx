import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const EditorialObservation: React.FC = () => {
  const { dashboardData } = useDashboard();
  // Using the first insight as requested
  const insight = dashboardData.insights[0];

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>✦ FINWISE AI NOTICED</h3>
      
      <div style={cardStyle}>
        <p style={statementStyle}>"{insight.title}"</p>
        
        <div style={impactContainerStyle}>
          <div style={impactLabelStyle}>POTENTIAL SAVING</div>
          <div style={impactRowStyle}>
            <span style={impactValueStyle}>{insight.impactValue} / MONTH</span>
            <span style={impactValueStyle}>{insight.impactYearly} / YEAR</span>
          </div>
        </div>
        
        <button style={btnStyle} className="chip">OPTIMIZE SPENDING &rarr;</button>
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1rem',
  color: 'var(--accent-gold)',
  letterSpacing: '0.05em',
  margin: 0
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(201, 164, 108, 0.05)',
  border: '1px solid rgba(201, 164, 108, 0.2)',
  borderRadius: '12px',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  alignItems: 'flex-start',
  position: 'relative'
};

const statementStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.75rem',
  fontWeight: 400,
  color: 'var(--text-primary)',
  margin: 0,
  lineHeight: 1.3
};

const impactContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const impactLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em'
};

const impactRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'baseline'
};

const impactValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  color: 'var(--accent-gold)'
};

const btnStyle: React.CSSProperties = {
  background: 'var(--grad-primary)',
  border: 'none',
  color: '#000',
  fontFamily: 'var(--font-secondary)',
  fontWeight: 'bold',
  padding: '0.75rem 2rem',
  borderRadius: '4px',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  marginTop: '1rem'
};
