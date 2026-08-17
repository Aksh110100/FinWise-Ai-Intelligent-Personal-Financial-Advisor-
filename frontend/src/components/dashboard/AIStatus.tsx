import React from 'react';

interface AIStatusProps {
  score: number;
  status: string;
  summary: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ score, status, summary }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-3">
      <div style={aiLabelStyle}>FINWISE AI</div>
      
      <div style={contentGridStyle}>
        <div style={summaryStyle}>
          "{summary}"
        </div>
        
        <div style={healthScoreContainerStyle}>
          <div style={healthLabelStyle}>FINANCIAL HEALTH</div>
          <div style={scoreCircleStyle}>
            <div style={scoreNumberStyle}>{score} <span style={scoreMaxStyle}>/ 100</span></div>
          </div>
          <div style={statusStyle}>{status}</div>
        </div>
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '24px',
  padding: '48px',
  marginBottom: '80px',
  position: 'relative',
  overflow: 'hidden',
};

const aiLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--accent-gold)',
  marginBottom: '32px',
};

const contentGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',
  gap: '64px',
  alignItems: 'center',
};

const summaryStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
  lineHeight: 1.2,
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const healthScoreContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
};

const healthLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
};

const scoreCircleStyle: React.CSSProperties = {
  width: '180px',
  height: '180px',
  borderRadius: '50%',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  background: 'radial-gradient(circle at center, rgba(162, 194, 164, 0.05) 0%, transparent 70%)',
};

const scoreNumberStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '3.5rem',
  fontWeight: 600,
  color: 'var(--text-positive)',
};

const scoreMaxStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  fontWeight: 400,
};

const statusStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-positive)',
  letterSpacing: '0.1em',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 768px) {
      .ai-status-content-grid {
        grid-template-columns: 1fr !important;
        gap: 48px !important;
      }
      .ai-status-container {
        padding: 32px !important;
      }
    }
  `;
  document.head.appendChild(style);
  contentGridStyle.className = 'ai-status-content-grid';
  containerStyle.className = 'ai-status-container';
}
