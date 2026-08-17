import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section id="final-cta" style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>
          YOUR FUTURE<br/>
          STARTS WITH<br/>
          TODAY'S DECISIONS.
        </h2>
        <p style={subtitleStyle}>
          Let AI turn your financial data into a plan you can actually understand.
        </p>
        <div style={ctaGroupStyle}>
          <Link to="/login" style={primaryCtaStyle}>
            BUILD MY FINANCIAL PLAN
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Link>
          <a href="#hero" style={secondaryCtaStyle}>
            EXPLORE FINWISE AI
          </a>
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
  backgroundColor: 'transparent', // Pure black replaced with transparent
};

const containerStyle: React.CSSProperties = {
  maxWidth: '800px',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '40px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(3rem, 6vw, 5rem)',
  fontWeight: 800,
  lineHeight: 0.95,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  color: 'var(--text-secondary)',
  maxWidth: '400px',
};

const ctaGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  marginTop: '24px',
};

const primaryCtaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--bg-primary)',
  backgroundColor: 'var(--text-primary)',
  padding: '16px 32px',
  borderRadius: '4px',
  textDecoration: 'none',
  transition: 'var(--transition-smooth)',
};

const secondaryCtaStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  letterSpacing: '0.05em',
  transition: 'var(--transition-smooth)',
};

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #final-cta a[href="#signup"]:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(255,255,255,0.15);
    }
    #final-cta a[href="#hero"]:hover {
      color: var(--text-primary);
    }
  `;
  document.head.appendChild(styleElement);
}
