import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string) => {
    scrollToSection(href);
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: isScrolled ? '16px 32px' : '32px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'none', // Allows clicking through the empty space
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Floating Logo (Top Left) */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); handleLinkClick('#hero'); }} 
          className="floating-logo"
          style={{...logoStyle, padding: '4px 16px', background: 'transparent', border: 'none', boxShadow: 'none'}}
        >
          <img src="/logo.png" alt="FinWise AI" className="navbar-logo-img" style={{ height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(201, 164, 108, 0.2))', transition: 'all 0.3s ease' }} />
        </a>

        {/* Floating Action CTAs (Top Right) */}
        <div style={actionsContainerStyle} className="floating-actions">
          <Link to="/login" className="nav-login-btn" style={loginBtnStyle}>
            Log in
          </Link>
          <Link to="/register" className="nav-signup-btn" style={signupBtnStyle}>
            <span style={{ position: 'relative', zIndex: 2 }}>Get Started</span>
            <div style={arrowContainerStyle} className="arrow-container">
              <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

// Navbar Premium Styles

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  textDecoration: 'none',
  cursor: 'pointer',
  pointerEvents: 'auto',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  padding: '6px 14px 6px 6px',
  borderRadius: '100px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
};

const logoIconContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  backgroundColor: '#fff',
  boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
  transition: 'all 0.3s ease',
};

const logoTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary, "Inter", sans-serif)',
  fontSize: '0.875rem',
  fontWeight: 800,
  letterSpacing: '0.05em',
  color: '#fff',
};

const actionsContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  pointerEvents: 'auto',
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  padding: '6px 6px 6px 16px',
  borderRadius: '100px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
};

const loginBtnStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  padding: '6px 10px',
  borderRadius: '100px',
  transition: 'all 0.3s ease',
};

const signupBtnStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#000',
  backgroundColor: '#fff',
  padding: '6px 8px 6px 16px',
  borderRadius: '100px',
  textDecoration: 'none',
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  boxShadow: '0 4px 15px rgba(255, 255, 255, 0.1)',
};

const arrowContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  position: 'relative',
  zIndex: 2,
};

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .floating-logo:hover {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }
    
    .floating-logo:hover .navbar-logo-img {
      transform: scale(1.05);
      filter: drop-shadow(0 0 20px rgba(201, 164, 108, 0.6)) !important;
    }

    .floating-actions:hover {
      border-color: rgba(255, 255, 255, 0.15) !important;
    }
    
    .nav-login-btn:hover {
      color: #fff !important;
      background: rgba(255, 255, 255, 0.08);
    }
    
    .nav-signup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 255, 255, 0.25) !important;
      background-color: #f8f8f8 !important;
    }
    
    .nav-signup-btn:hover .arrow-container {
      transform: translateX(4px);
      background-color: rgba(0, 0, 0, 0.1) !important;
    }
    
    @media (max-width: 600px) {
      .nav-login-btn {
        display: none !important;
      }
      .floating-actions {
        padding: 6px !important;
      }
    }
  `;
  document.head.appendChild(styleElement);
}
