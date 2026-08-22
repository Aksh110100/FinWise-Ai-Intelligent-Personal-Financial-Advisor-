import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const [displayPath, setDisplayPath] = useState(location.pathname);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayPath) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setDisplayPath(location.pathname);
        setIsAnimatingOut(false);
      }, 350); // duration matches CSS exit animation
      return () => clearTimeout(timer);
    }
  }, [location.pathname, displayPath]);

  return (
    <div style={pageStyle}>
      <img 
        src="/financial-frames/frame_000100.jpg" 
        alt="Financial Background" 
        style={bgStyle} 
      />
      
      <div style={containerStyle} className="auth-container">
        <div style={leftColStyle} className="auth-left-col">
          <div style={logoStyle} className="auth-logo">
            <img src="/logo.png" alt="FinWise AI" style={{ height: '76px', objectFit: 'contain', transform: 'translate(-40px, 0)' }} />
          </div>
          <h1 style={titleStyle}>
            YOUR MONEY.<br/>
            UNDERSTOOD.
          </h1>
          <p style={descStyle}>
            AI-powered financial guidance<br/>
            for smarter decisions.
          </p>
        </div>

        <div style={rightColStyle} className="auth-right-col">
          <div style={glassPanelStyle} className="auth-glass-panel">
            {displayPath === '/register' ? (
              <RegisterForm isAnimatingOut={isAnimatingOut} />
            ) : displayPath === '/forgot-password' ? (
              <ForgotPasswordForm isAnimatingOut={isAnimatingOut} />
            ) : (
              <LoginForm isAnimatingOut={isAnimatingOut} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout Styles
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#050505',
  position: 'relative',
  display: 'flex',
  fontFamily: 'var(--font-secondary)',
};

const bgStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.15,
  zIndex: 0,
  pointerEvents: 'none',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '40px',
  zIndex: 1,
  gap: '60px',
};

const leftColStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const logoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1rem',
  fontWeight: 800,
  letterSpacing: '0.05em',
  color: 'var(--text-primary)',
  marginBottom: '64px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
  fontFamily: 'var(--font-primary)',
  fontWeight: 600,
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
  marginBottom: '24px',
};

const descStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: 1.6,
  color: 'var(--text-secondary)',
};

const rightColStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const glassPanelStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '440px',
  background: 'rgba(8, 8, 8, 0.30)',
  backdropFilter: 'blur(18px) saturate(120%)',
  WebkitBackdropFilter: 'blur(18px) saturate(120%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  boxShadow: '0 30px 100px rgba(0, 0, 0, 0.45)',
  padding: '48px 40px',
  // minHeight ensures no weird jumps when switching to a smaller form,
  // but smooth height transitions can be handled in CSS if needed.
  transition: 'height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
  position: 'relative',
  overflow: 'hidden',
};

export default AuthPage;
