import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const UpcomingMoney: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { upcomingMoney } = dashboardData;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>UPCOMING</h3>
      
      <div style={timelineContainerStyle}>
        {upcomingMoney.map((item, index) => (
          <div key={index} style={timelineItemStyle}>
            <div style={dateBoxStyle}>
              {item.date}
            </div>
            
            <div style={contentBoxStyle}>
              <div style={labelStyle}>{item.label}</div>
              <div style={{
                ...amountStyle, 
                color: item.type === 'income' ? 'var(--text-positive)' : 'var(--text-primary)'
              }}>
                {item.amount}
              </div>
            </div>
            
            {/* Timeline connectors */}
            {index !== upcomingMoney.length - 1 && (
              <div style={connectorStyle} />
            )}
            
            <div style={{...dotStyle, background: item.type === 'income' ? 'var(--accent-emerald)' : 'var(--text-secondary)'}} />
          </div>
        ))}
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

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.2rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: 0
};

const timelineContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '2rem'
};

const timelineItemStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  alignItems: 'center',
  position: 'relative'
};

const dateBoxStyle: React.CSSProperties = {
  width: '60px',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em',
  textAlign: 'right',
  flexShrink: 0
};

const contentBoxStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
  padding: '1rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '8px'
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-primary)',
};

const amountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.1rem',
};

const connectorStyle: React.CSSProperties = {
  position: 'absolute',
  left: '81px',
  top: '3rem',
  bottom: '-1.5rem',
  width: '1px',
  background: 'rgba(255,255,255,0.1)',
  zIndex: 0
};

const dotStyle: React.CSSProperties = {
  position: 'absolute',
  left: '77px', // 60px (date) + 24px (gap) / 2 approx, adjusting visually
  top: '50%',
  transform: 'translateY(-50%)',
  width: '9px',
  height: '9px',
  borderRadius: '50%',
  border: '2px solid var(--bg-primary)',
  zIndex: 1
};
