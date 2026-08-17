import React, { useRef, useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const FutureForecast: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { futureForecast } = dashboardData;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div style={containerStyle} ref={containerRef}>
      <h3 style={titleStyle}>YOUR MONEY, 6 MONTHS FROM NOW</h3>
      
      <div style={cardStyle}>
        <div style={topStatsStyle}>
          <div style={statColStyle}>
            <span style={statLabelStyle}>CURRENT</span>
            <span style={statValueStyle}>{futureForecast.current}</span>
          </div>
          <div style={statColStyle}>
            <span style={statLabelStyle}>PROJECTED</span>
            <span style={{...statValueStyle, color: 'var(--accent-gold)'}}>{futureForecast.months6}</span>
          </div>
        </div>

        <p style={descriptionStyle}>At your current spending and savings pace.</p>
        
        {/* Simplified Curve visualization */}
        <div style={curveContainerStyle}>
          <svg viewBox="0 0 400 120" width="100%" height="100%" preserveAspectRatio="none">
            {/* Grid/Base line */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            
            {/* Projected Curve */}
            <path 
              d="M 0 100 Q 200 80 400 20" 
              fill="none" 
              stroke="var(--accent-gold)" 
              strokeWidth="3"
              className={isVisible ? 'draw-forecast' : ''}
              style={{ strokeDasharray: 500, strokeDashoffset: 500 }}
            />
            
            <circle cx="0" cy="100" r="4" fill="var(--text-primary)" className={isVisible ? 'fade-in-dot delay-1' : 'fade-in-dot'} />
            <circle cx="400" cy="20" r="4" fill="var(--accent-gold)" className={isVisible ? 'fade-in-dot delay-2' : 'fade-in-dot'} />
          </svg>
        </div>

        <div style={milestonesGridStyle}>
          <div style={milestoneStyle}>
            <span style={milestoneLabelStyle}>3 MONTHS</span>
            <span style={milestoneValueStyle}>{futureForecast.months3}</span>
          </div>
          <div style={{...milestoneStyle, borderLeft: '1px solid var(--glass-border)', borderRight: '1px solid var(--glass-border)', padding: '0 1rem'}}>
            <span style={{...milestoneLabelStyle, color: 'var(--accent-gold)'}}>6 MONTHS (PROJECTED)</span>
            <span style={{...milestoneValueStyle, color: 'var(--accent-gold)'}}>{futureForecast.months6}</span>
          </div>
          <div style={{...milestoneStyle, alignItems: 'flex-end'}}>
            <span style={milestoneLabelStyle}>12 MONTHS</span>
            <span style={milestoneValueStyle}>{futureForecast.months12}</span>
          </div>
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
  gap: '1.5rem',
};

const topStatsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '4rem',
};

const statColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem'
};

const statLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.05em'
};

const statValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2.5rem',
  color: 'var(--text-primary)',
  lineHeight: 1
};

const descriptionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  margin: 0,
  fontStyle: 'italic'
};

const curveContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '120px',
  marginTop: '1rem',
  marginBottom: '1rem',
};

const milestonesGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  borderTop: '1px solid var(--glass-border)',
  paddingTop: '2rem',
  marginTop: '1rem'
};

const milestoneStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const milestoneLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.05em'
};

const milestoneValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  color: 'var(--text-primary)'
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .draw-forecast {
      animation: drawForecastLine 2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    @keyframes drawForecastLine {
      to { stroke-dashoffset: 0; }
    }
    .fade-in-dot {
      opacity: 0;
      transition: opacity 0.5s ease forwards;
    }
    .fade-in-dot.delay-1 { animation: fadeIn 0.5s 0.5s forwards; }
    .fade-in-dot.delay-2 { animation: fadeIn 0.5s 1.5s forwards; }
    @keyframes fadeIn {
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
