import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const SpendingSnapshot: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { spending } = dashboardData;

  // Assume max percentage is the highest in the array to scale bars properly
  const maxPercentage = Math.max(...spending.map(s => s.percentage));

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>WHERE YOUR MONEY GOES</h3>
      
      <div style={listStyle}>
        {spending.map((item, index) => (
          <div key={item.category} style={itemContainerStyle}>
            <div style={infoRowStyle}>
              <span style={categoryStyle}>{item.category}</span>
              <span style={amountStyle}>{item.amount}</span>
            </div>
            
            <div style={barTrackStyle}>
              <div 
                style={{
                  ...barFillStyle,
                  width: `${(item.percentage / maxPercentage) * 100}%`,
                  background: index === 0 ? 'var(--grad-primary)' : 'rgba(255,255,255,0.2)'
                }} 
                className="grow-bar"
              />
            </div>
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

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '2rem'
};

const itemContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const categoryStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-primary)',
  letterSpacing: '0.02em'
};

const amountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.1rem',
  color: 'var(--text-primary)'
};

const barTrackStyle: React.CSSProperties = {
  width: '100%',
  height: '4px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '2px',
  overflow: 'hidden'
};

const barFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: '2px',
  transformOrigin: 'left',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .grow-bar {
      animation: growBar 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      transform: scaleX(0);
    }
    @keyframes growBar {
      to { transform: scaleX(1); }
    }
  `;
  document.head.appendChild(style);
}
