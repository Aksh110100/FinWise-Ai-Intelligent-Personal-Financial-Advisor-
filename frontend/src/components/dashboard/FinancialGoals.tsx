import React from 'react';

interface Goal {
  name: string;
  current: string;
  target: string;
  progress: number;
}

interface FinancialGoalsProps {
  goals: Goal[];
}

export const FinancialGoals: React.FC<FinancialGoalsProps> = ({ goals }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-9">
      <h3 style={sectionTitleStyle}>YOUR GOALS</h3>
      
      <div style={gridStyle}>
        {goals.map((goal, idx) => (
          <div key={idx} style={goalStyle}>
            <div style={headerStyle}>
              <span style={nameStyle}>{goal.name}</span>
              <span style={amountsStyle}>{goal.current} <span style={targetStyle}>/ {goal.target}</span></span>
            </div>
            <div style={barContainerStyle}>
              <div style={{...barFillStyle, width: `${goal.progress}%`}} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  marginBottom: '80px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
  marginBottom: '48px',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '40px',
};

const goalStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
};

const nameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const amountsStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.125rem',
  color: 'var(--text-primary)',
};

const targetStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
};

const barContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '2px',
  background: 'rgba(255, 255, 255, 0.05)',
  position: 'relative',
};

const barFillStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  background: 'var(--text-positive)',
  transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
};
