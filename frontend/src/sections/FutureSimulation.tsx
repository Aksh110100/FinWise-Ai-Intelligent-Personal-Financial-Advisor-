import React, { useState } from 'react';

export const FutureSimulation: React.FC = () => {
  const [scenario, setScenario] = useState<0 | 1 | 2>(1);

  const scenarios = [
    { label: 'SAVE ₹5K / MONTH', data: [1, 1.2, 1.8, 2.5, 4.0] },
    { label: 'INVEST ₹10K / MONTH', data: [1, 1.5, 2.8, 4.5, 8.5] },
    { label: 'INVEST ₹15K / MONTH', data: [1, 1.8, 3.8, 6.5, 13.0] },
  ];

  const labels = ['TODAY', '1 YEAR', '3 YEARS', '5 YEARS', '10 YEARS'];

  // SVG dimensions
  const w = 800;
  const h = 300;
  const xPad = 50;
  const yPad = 50;
  
  // Max value across all scenarios for scaling
  const maxVal = 13.0;

  const getPoints = (data: number[]) => {
    return data.map((val, i) => {
      const x = xPad + (i * ((w - 2 * xPad) / (data.length - 1)));
      const y = h - yPad - ((val / maxVal) * (h - 2 * yPad));
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <section id="future-simulation" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>WHAT IF ONE DECISION<br/>CHANGED YOUR FUTURE?</h2>
        </div>

        <div style={selectorContainerStyle}>
          {scenarios.map((s, i) => (
            <button 
              key={i}
              onClick={() => setScenario(i as 0 | 1 | 2)}
              style={{
                ...buttonStyle,
                backgroundColor: scenario === i ? 'rgba(201, 164, 108, 0.1)' : 'transparent',
                borderColor: scenario === i ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                color: scenario === i ? 'var(--accent-gold)' : 'var(--text-secondary)'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div style={chartContainerStyle}>
          <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Grid Lines */}
            {[0, 1, 2, 3].map(i => {
              const y = h - yPad - (i * ((h - 2 * yPad) / 3));
              return (
                <line key={i} x1={xPad} y1={y} x2={w - xPad} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              );
            })}
            
            {/* X Axis Labels */}
            {labels.map((label, i) => {
              const x = xPad + (i * ((w - 2 * xPad) / (labels.length - 1)));
              return (
                <text key={i} x={x} y={h - 20} fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontWeight="600" letterSpacing="0.1em">
                  {label}
                </text>
              );
            })}

            {/* Line Path */}
            <polyline 
              points={getPoints(scenarios[scenario].data)} 
              fill="none" 
              stroke="var(--accent-gold)" 
              strokeWidth="3" 
              style={{ transition: 'all 0.5s ease-in-out' }}
            />

            {/* Data Points */}
            {scenarios[scenario].data.map((val, i) => {
              const x = xPad + (i * ((w - 2 * xPad) / (scenarios[scenario].data.length - 1)));
              const y = h - yPad - ((val / maxVal) * (h - 2 * yPad));
              return (
                <circle 
                  key={i} 
                  cx={x} 
                  cy={y} 
                  r="5" 
                  fill="var(--bg-primary)" 
                  stroke="var(--accent-gold)" 
                  strokeWidth="2" 
                  style={{ transition: 'all 0.5s ease-in-out' }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
};

const sectionStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 40px',
  backgroundColor: 'transparent',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '900px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '64px',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const selectorContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  flexWrap: 'wrap',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 24px',
  border: '1px solid',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)',
  outline: 'none',
};

const chartContainerStyle: React.CSSProperties = {
  width: '100%',
  position: 'relative',
};
