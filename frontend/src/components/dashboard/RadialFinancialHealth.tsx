import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const RadialFinancialHealth: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { health } = dashboardData;
  const breakdown = health.breakdown;

  const scoreColor = health.score > 80 ? 'var(--accent-emerald)' : 'var(--accent-gold)';

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>FINANCIAL HEALTH</h3>
      
      <div style={contentWrapperStyle}>
        <div style={radialContainerStyle}>
          <svg viewBox="0 0 200 200" width="100%" height="100%" style={svgStyle}>
            {/* Background circle */}
            <circle 
              cx="100" cy="100" r="90" 
              fill="none" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="4" 
            />
            {/* Score progress circle */}
            <circle 
              cx="100" cy="100" r="90" 
              fill="none" 
              stroke={scoreColor} 
              strokeWidth="4"
              strokeDasharray={`${(health.score / 100) * 565.48} 565.48`} // 2 * PI * 90 = 565.48
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
              className="draw-circle"
            />
            
            {/* Inner dots/ticks for aesthetics */}
            {Array.from({length: 12}).map((_, i) => (
              <line 
                key={i}
                x1="100" y1="20" x2="100" y2="25"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}

            <text x="100" y="95" textAnchor="middle" fill="var(--text-primary)" fontSize="48" fontFamily="var(--font-primary)" fontWeight="300">
              {health.score}
            </text>
            <text x="100" y="125" textAnchor="middle" fill="var(--text-secondary)" fontSize="14" fontFamily="var(--font-secondary)" letterSpacing="0.1em">
              / 100
            </text>
          </svg>
        </div>

        <div style={detailsContainerStyle}>
          <div style={breakdownGridStyle}>
            <BreakdownItem label="SPENDING" value={breakdown.spending} />
            <BreakdownItem label="SAVINGS" value={breakdown.savings} />
            <BreakdownItem label="INVESTMENTS" value={breakdown.investments} />
            <BreakdownItem label="EMERGENCY FUND" value={breakdown.emergencyFund} />
            <BreakdownItem label="DEBT" value={breakdown.debt} />
          </div>

          <p style={aiExplanationStyle}>
            {health.summary}
          </p>
        </div>
      </div>
    </div>
  );
};

const BreakdownItem: React.FC<{label: string, value: number}> = ({ label, value }) => {
  const color = value > 80 ? 'var(--accent-emerald)' : value > 60 ? 'var(--accent-gold)' : 'var(--text-secondary)';
  return (
    <div style={breakdownItemStyle}>
      <span style={breakdownLabelStyle}>{label}</span>
      <span style={{...breakdownValueStyle, color}}>{value}</span>
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

const contentWrapperStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4rem',
  alignItems: 'center',
  flexWrap: 'wrap'
};

const radialContainerStyle: React.CSSProperties = {
  width: '240px',
  height: '240px',
  flexShrink: 0,
  position: 'relative'
};

const svgStyle: React.CSSProperties = {
  filter: 'drop-shadow(0 0 10px rgba(99, 181, 138, 0.1))'
};

const detailsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  flex: 1,
  minWidth: '280px'
};

const breakdownGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '1.5rem',
};

const breakdownItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const breakdownLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  color: 'var(--text-muted)'
};

const breakdownValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
};

const aiExplanationStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--accent-gold)',
  lineHeight: 1.6,
  padding: '1rem 1.5rem',
  background: 'rgba(201, 164, 108, 0.05)',
  borderLeft: '2px solid var(--accent-gold)',
  borderRadius: '0 8px 8px 0',
  margin: 0
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .draw-circle {
      animation: drawCircle 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes drawCircle {
      from { stroke-dashoffset: 565.48; }
      to { stroke-dashoffset: 0; }
    }
  `;
  document.head.appendChild(style);
}
