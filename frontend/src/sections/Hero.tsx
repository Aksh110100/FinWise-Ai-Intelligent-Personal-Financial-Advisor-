import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div style={heroContainerStyle} id="hero">
      <div style={contentStyle}>
        <div style={badgeStyle}>AI-POWERED FINANCIAL INTELLIGENCE</div>
        <h1 style={titleStyle}>
          KNOW YOUR MONEY.<br />
          GROW YOUR FUTURE.
        </h1>
        <p style={descStyle}>
          Your personal AI financial advisor that understands your spending, helps you save smarter, and plans what comes next.
        </p>
        
        <div style={ctaGroupStyle}>
          <Link to="/login" className="primary-cta" style={primaryCtaStyle}>
            START YOUR FINANCIAL PLAN
            <ArrowRight size={16} style={{ marginLeft: '8px' }} />
          </Link>
          <a href="#scroll-transformation" style={secondaryCtaStyle}>
            SEE HOW IT WORKS
            <ArrowDown size={16} style={{ marginLeft: '8px' }} />
          </a>
        </div>
      </div>
      {/* 
        The right side of the hero visually integrates with the global scroll animation. 
        In App.tsx, the ScrollFinancialAnimation spans across this section and the next,
        acting as the sticky visual right side. 
      */}
      <div style={rightPlaceholderStyle}>
        {/* Placeholder for spacing, actual animation is overlaid/sticky from App layout */}
      </div>
    </div>
  );
};

const heroContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  position: 'relative',
  paddingTop: '80px', // Navbar height
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '80px 40px 0',
  textAlign: 'center',
  background: 'transparent',
  zIndex: 1,
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
};

const rightPlaceholderStyle: React.CSSProperties = {
  display: 'none',
};

const badgeStyle: React.CSSProperties = {
  color: 'var(--accent-gold)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  marginBottom: '24px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
  lineHeight: '1.05',
  fontWeight: 600,
  fontFamily: 'var(--font-primary)',
  color: 'transparent',
  backgroundImage: 'var(--grad-text)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  letterSpacing: '-0.02em',
  marginBottom: '32px',
};

const descStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: '1.6',
  color: 'var(--text-secondary)',
  maxWidth: '600px',
  marginBottom: '48px',
};

const ctaGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
};

const primaryCtaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--bg-primary)',
  backgroundColor: 'var(--accent-gold)',
  padding: '16px 32px',
  borderRadius: '4px',
  textDecoration: 'none',
  boxShadow: '0 0 40px rgba(201, 164, 108, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
};

const secondaryCtaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  padding: '8px 0',
  transition: 'var(--transition-smooth)',
};

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #hero a:hover {
      opacity: 0.8;
      transform: translateY(-2px);
    }
    #hero a.primary-cta:hover {
      opacity: 1;
      box-shadow: 0 10px 50px rgba(201, 164, 108, 0.5) !important;
    }
  `;
  document.head.appendChild(styleElement);
}
