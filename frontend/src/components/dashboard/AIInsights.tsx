import React from 'react';

interface Insight {
  type: string;
  title: string;
  impactLabel: string;
  impactValue: string;
  color: string;
}

interface AIInsightsProps {
  insights: Insight[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-6">
      <h3 style={sectionTitleStyle}>WHAT FINWISE SEES</h3>
      
      <div style={gridStyle}>
        {insights.map((insight, idx) => (
          <div key={idx} style={cardStyle}>
            <div style={typeStyle}>{insight.type}</div>
            <p style={titleStyle}>{insight.title}</p>
            <div style={impactContainerStyle}>
              <div style={impactLabelStyle}>{insight.impactLabel}</div>
              <div style={{...impactValueStyle, color: insight.color}}>{insight.impactValue}</div>
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '32px',
};

const cardStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  padding: '32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const typeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--accent-gold)',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  lineHeight: 1.4,
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const impactContainerStyle: React.CSSProperties = {
  marginTop: 'auto',
  paddingTop: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
};

const impactLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  marginBottom: '8px',
};

const impactValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
};
