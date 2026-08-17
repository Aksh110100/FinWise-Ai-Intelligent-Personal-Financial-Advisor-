import React from 'react';
import { Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={brandStyle}>
          <div style={logoStyle}>
            <Compass size={20} color="var(--accent-gold)" />
            <span style={logoTextStyle}>FINWISE AI</span>
          </div>
          <p style={descStyle}>AI-powered personal financial intelligence.</p>
        </div>
        
        <div style={linksContainerStyle}>
          <a href="#hero" style={linkStyle}>Product</a>
          <a href="#ai-advisor" style={linkStyle}>AI Advisor</a>
          <a href="#future-simulation" style={linkStyle}>Future Planning</a>
          <a href="#privacy" style={linkStyle}>Privacy</a>
          <a href="#contact" style={linkStyle}>Contact</a>
        </div>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  backgroundColor: 'transparent',
  padding: '64px 40px',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '40px',
};

const brandStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const logoTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1rem',
  fontWeight: 800,
  letterSpacing: '0.05em',
  color: 'var(--text-primary)',
};

const descStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-muted)',
};

const linksContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '32px',
  flexWrap: 'wrap',
};

const linkStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    footer a:hover {
      color: var(--text-primary) !important;
    }
  `;
  document.head.appendChild(styleElement);
}
