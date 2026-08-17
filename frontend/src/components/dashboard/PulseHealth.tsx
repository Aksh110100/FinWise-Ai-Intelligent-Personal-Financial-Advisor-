import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface PulseHealthProps {
  score: number;
}

export const PulseHealth: React.FC<PulseHealthProps> = ({ score }) => {
  const { targetRef, isIntersecting } = useIntersectionObserver();

  return (
    <section className="cinematic-section" ref={targetRef}>
      <div className={`section-divider ${isIntersecting ? 'visible delay-1' : ''}`}>
        <span>FINANCIAL HEALTH</span>
      </div>

      <div style={containerStyle} className={`anim-fade-up ${isIntersecting ? 'visible delay-2' : ''}`}>
        <div style={scoreContainerStyle}>
          <span style={scoreStyle}>{score}</span>
          <span style={statusStyle}>HEALTHY</span>
        </div>
        
        <div style={barsContainerStyle}>
          <PulseBar label="SPENDING" activeBlocks={8} totalBlocks={10} />
          <PulseBar label="SAVING" activeBlocks={10} totalBlocks={10} />
          <PulseBar label="INVESTING" activeBlocks={7} totalBlocks={10} />
          <PulseBar label="PLANNING" activeBlocks={8} totalBlocks={10} />
        </div>
      </div>
    </section>
  );
};

const PulseBar: React.FC<{label: string, activeBlocks: number, totalBlocks: number}> = ({ label, activeBlocks, totalBlocks }) => {
  const blocks = Array.from({ length: totalBlocks }, (_, i) => i < activeBlocks);
  
  return (
    <div style={pulseItemStyle}>
      <div style={pulseLabelStyle}>{label}</div>
      <div style={blocksContainerStyle}>
        {blocks.map((isActive, idx) => (
          <span key={idx} style={{
            ...blockStyle,
            opacity: isActive ? 1 : 0.2,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}>█</span>
        ))}
      </div>
    </div>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  paddingTop: '60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '64px',
};

const scoreContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
};

const scoreStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '4rem',
  fontWeight: 500,
  lineHeight: 1,
  color: 'var(--text-positive)',
};

const statusStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.2em',
  color: 'var(--text-secondary)',
};

const barsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'flex-start',
};

const pulseItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const pulseLabelStyle: React.CSSProperties = {
  width: '100px',
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
  textAlign: 'right',
};

const blocksContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2px',
  fontFamily: 'monospace',
  fontSize: '1rem',
};

const blockStyle: React.CSSProperties = {
  transition: 'opacity 0.3s',
};
