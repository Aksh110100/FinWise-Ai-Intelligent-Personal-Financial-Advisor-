import React from 'react';

interface ProjectionData {
  current: string;
  fiveYear: string;
  tenYear: string;
  currentPathValue: string;
  optimizedPathValue: string;
}

interface FutureProjectionProps {
  projection: ProjectionData;
}

export const FutureProjection: React.FC<FutureProjectionProps> = ({ projection }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-7">
      <h3 style={sectionTitleStyle}>YOUR FINANCIAL FUTURE</h3>
      
      <div style={timelineStyle}>
        <div style={pointStyle}>
          <div style={pointLabelStyle}>CURRENT</div>
          <div style={pointValueStyle}>{projection.current}</div>
        </div>
        
        <div style={lineStyle}></div>
        
        <div style={pointStyle}>
          <div style={pointLabelStyle}>5 YEARS</div>
          <div style={{...pointValueStyle, color: 'var(--accent-gold)'}}>{projection.fiveYear}</div>
        </div>
        
        <div style={lineStyle}></div>
        
        <div style={pointStyle}>
          <div style={pointLabelStyle}>10 YEARS</div>
          <div style={{...pointValueStyle, color: 'var(--text-positive)'}}>{projection.tenYear}</div>
        </div>
      </div>

      <div style={comparisonStyle}>
        <div style={comparisonBoxStyle}>
          <div style={comparisonLabelStyle}>Current Path</div>
          <div style={comparisonValueStyle}>{projection.currentPathValue}</div>
        </div>
        <div style={{...comparisonBoxStyle, borderLeft: '1px solid rgba(255, 255, 255, 0.1)'}}>
          <div style={{...comparisonLabelStyle, color: 'var(--text-positive)'}}>AI Optimized Path</div>
          <div style={{...comparisonValueStyle, color: 'var(--text-positive)'}}>{projection.optimizedPathValue}</div>
        </div>
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

const timelineStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '48px',
};

const pointStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  zIndex: 1,
};

const pointLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
};

const pointValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const lineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(201, 164, 108, 0.3) 100%)',
  margin: '0 24px',
  marginTop: '16px',
};

const comparisonStyle: React.CSSProperties = {
  display: 'flex',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  overflow: 'hidden',
};

const comparisonBoxStyle: React.CSSProperties = {
  flex: 1,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const comparisonLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
};

const comparisonValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
};
