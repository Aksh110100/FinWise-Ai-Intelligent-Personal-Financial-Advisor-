import React, { useState, useEffect } from 'react';

export const FinancialXRay: React.FC = () => {
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnalyzed(true), 1000);
        }
      },
      { threshold: 0.5 }
    );
    const el = document.getElementById('financial-xray');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const metrics = [
    { label: 'SPENDING', before: 'HIGH', after: 'OPTIMIZED', beforeVal: 85, afterVal: 40, color: '#f43f5e', afterColor: 'var(--accent-emerald)' },
    { label: 'SAVINGS', before: 'LOW', after: '↑', beforeVal: 15, afterVal: 60, color: 'var(--text-secondary)', afterColor: 'var(--accent-emerald)' },
    { label: 'INVESTING', before: 'LOW', after: '↑', beforeVal: 10, afterVal: 70, color: 'var(--text-secondary)', afterColor: 'var(--accent-emerald)' },
    { label: 'PLANNING', before: 'LOW', after: 'STRONG', beforeVal: 20, afterVal: 85, color: 'var(--text-secondary)', afterColor: 'var(--accent-gold)' },
  ];

  return (
    <section id="financial-xray" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>SEE WHAT YOUR MONEY<br/>IS HIDING.</h2>
        </div>

        <div style={gridStyle}>
          <div style={colStyle}>
            <h3 style={colHeaderStyle}>BEFORE AI</h3>
            {metrics.map((m, i) => (
              <div key={i} style={metricRowStyle}>
                <div style={labelStyle}>{m.label}</div>
                <div style={barContainerStyle}>
                  <div style={{...barStyle, width: `${m.beforeVal}%`, backgroundColor: m.color}}></div>
                </div>
                <div style={valStyle}>{m.before}</div>
              </div>
            ))}
          </div>
          
          <div style={colStyle}>
            <h3 style={{...colHeaderStyle, color: 'var(--accent-gold)'}}>AFTER AI</h3>
            {metrics.map((m, i) => (
              <div key={i} style={metricRowStyle}>
                <div style={labelStyle}>{m.label}</div>
                <div style={barContainerStyle}>
                  <div style={{
                    ...barStyle, 
                    width: analyzed ? `${m.afterVal}%` : `${m.beforeVal}%`, 
                    backgroundColor: analyzed ? m.afterColor : m.color
                  }}></div>
                </div>
                <div style={{...valStyle, color: analyzed ? m.afterColor : 'var(--text-secondary)'}}>
                  {analyzed ? m.after : m.before}
                </div>
              </div>
            ))}
          </div>
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
  maxWidth: '1000px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '80px',
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

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '64px',
};

const colStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const colHeaderStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-muted)',
  marginBottom: '16px',
};

const metricRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '100px 1fr 100px',
  alignItems: 'center',
  gap: '16px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--text-secondary)',
};

const barContainerStyle: React.CSSProperties = {
  height: '4px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  width: '100%',
  borderRadius: '2px',
  overflow: 'hidden',
};

const barStyle: React.CSSProperties = {
  height: '100%',
  transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
  borderRadius: '2px',
};

const valStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
  textAlign: 'right',
  transition: 'color 1s ease',
};
