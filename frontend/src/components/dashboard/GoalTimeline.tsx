import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const GoalTimeline: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { goals } = dashboardData;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>YOUR GOALS</h3>
      
      <div style={listStyle}>
        {goals.map((goal, idx) => (
          <div key={idx} style={goalCardStyle} className="chip">
            <div style={goalHeaderStyle}>
              <span style={goalNameStyle}>{goal.name}</span>
              <span style={goalTargetStyle}>Target: {goal.date}</span>
            </div>
            
            <div style={amountRowStyle}>
              <span style={amountStyle}>{goal.current} / {goal.target}</span>
              <span style={percentageStyle}>{goal.progress}%</span>
            </div>
            
            <div style={barTrackStyle}>
              <div 
                style={{
                  ...barFillStyle,
                  width: `${goal.progress}%`
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
  gap: '1.5rem'
};

const goalCardStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  cursor: 'pointer'
};

const goalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline'
};

const goalNameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.2rem',
  color: 'var(--text-primary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase'
};

const goalTargetStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-muted)'
};

const amountRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline'
};

const amountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-secondary)'
};

const percentageStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  color: 'var(--text-primary)'
};

const barTrackStyle: React.CSSProperties = {
  width: '100%',
  height: '6px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '3px',
  overflow: 'hidden'
};

const barFillStyle: React.CSSProperties = {
  height: '100%',
  borderRadius: '3px',
  background: 'var(--grad-primary)',
  transformOrigin: 'left',
};
