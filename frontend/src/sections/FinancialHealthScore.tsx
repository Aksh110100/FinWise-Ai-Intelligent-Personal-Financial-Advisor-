import React, { useEffect, useState } from 'react';

export const FinancialHealthScore: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    const el = document.getElementById('health-score');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scores = [
    { label: 'Spending', val: 86 },
    { label: 'Savings', val: 78 },
    { label: 'Investing', val: 81 },
    { label: 'Planning', val: 84 },
  ];

  return (
    <section id="health-score" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={scoreMainStyle}>
          <div style={largeNumberStyle}>{isVisible ? 82 : 0} <span style={maxScoreStyle}>/ 100</span></div>
          <div style={healthLabelStyle}>FINANCIAL HEALTH</div>
        </div>

        <div style={breakdownStyle}>
          {scores.map((s, i) => (
            <div key={i} style={breakdownItemStyle}>
              <div style={breakdownHeaderStyle}>
                <span>{s.label}</span>
                <span>{isVisible ? s.val : 0}</span>
              </div>
              <div style={trackStyle}>
                <div style={{
                  ...progressStyle, 
                  width: isVisible ? `${s.val}%` : '0%',
                  transitionDelay: `${i * 0.15 + 0.5}s`
                }}></div>
              </div>
            </div>
          ))}
        </div>

        <p style={{...messageStyle, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(10px)'}}>
          YOU'RE MOVING IN THE RIGHT DIRECTION.
        </p>
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
  maxWidth: '600px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '64px',
};

const scoreMainStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const largeNumberStyle: React.CSSProperties = {
  fontSize: 'clamp(5rem, 12vw, 8rem)',
  fontWeight: 800,
  fontFamily: 'var(--font-primary)',
  color: 'var(--text-primary)',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'baseline',
  transition: 'all 2s ease-out',
};

const maxScoreStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  color: 'var(--text-muted)',
  marginLeft: '8px',
};

const healthLabelStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  color: 'var(--accent-gold)',
};

const breakdownStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const breakdownItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const breakdownHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
};

const trackStyle: React.CSSProperties = {
  width: '100%',
  height: '4px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '2px',
  overflow: 'hidden',
};

const progressStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: 'var(--accent-emerald)',
  transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
  borderRadius: '2px',
};

const messageStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
  textAlign: 'center',
  transition: 'all 1s ease',
  transitionDelay: '1.2s',
};
