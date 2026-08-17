import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const SafeToSpend: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { safeToSpend } = dashboardData;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerRowStyle}>
          <div style={labelStyle}>SAFE TO SPEND</div>
          <div style={valueStyle}>{safeToSpend.amount}</div>
        </div>
        
        <div style={indicatorContainerStyle}>
          <div style={indicatorBarStyle} />
        </div>

        <p style={descriptionStyle}>
          {safeToSpend.description}
        </p>

        <div style={detailsGridStyle}>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Next income</span>
            <span style={detailValueStyle}>{safeToSpend.nextIncomeAmount} in {safeToSpend.nextIncomeDays}</span>
          </div>
          <div style={detailItemStyle}>
            <span style={detailLabelStyle}>Upcoming commitments</span>
            <span style={detailValueStyle}>{safeToSpend.upcomingCommitments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem'
};

const cardStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid rgba(201, 164, 108, 0.15)', // Subtle gold border
  borderRadius: '16px',
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  position: 'relative',
  overflow: 'hidden'
};

const headerRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline'
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  color: 'var(--accent-gold)',
  letterSpacing: '0.05em'
};

const valueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '3.5rem',
  color: 'var(--text-primary)',
  lineHeight: 1
};

const indicatorContainerStyle: React.CSSProperties = {
  height: '2px',
  width: '100%',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '2px',
  position: 'relative'
};

const indicatorBarStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '65%', // illustrative
  background: 'var(--grad-accent-alt)',
  borderRadius: '2px',
  boxShadow: '0 0 10px rgba(99, 181, 138, 0.4)'
};

const descriptionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1.1rem',
  color: 'var(--text-secondary)',
  margin: 0
};

const detailsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
  paddingTop: '1.5rem',
  borderTop: '1px solid var(--glass-border)'
};

const detailItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const detailLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase'
};

const detailValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1.1rem',
  color: 'var(--text-primary)'
};
