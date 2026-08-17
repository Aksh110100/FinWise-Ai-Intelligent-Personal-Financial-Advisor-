import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll
      const sections = navLinks.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.3) {
          current = `#${section}`;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'AI Advisor', href: '#ai-advisor' },
    { label: 'Future Planning', href: '#future-simulation' },
    { label: 'Insights', href: '#financial-xray' },
  ];

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <nav style={{
        ...navbarStyle,
        backgroundColor: isScrolled ? 'rgba(5, 5, 5, 0.9)' : 'transparent',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
      }}>
        <div style={navContainerStyle}>
          {/* Logo */}
          <a href="#hero" onClick={(e) => { e.preventDefault(); handleLinkClick('#hero'); }} style={logoStyle}>
            FINWISE<br />AI
          </a>

          {/* Links (Desktop) */}
          <div style={linksContainerStyle}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                style={{
                  ...navLinkStyle,
                  color: activeSection === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeSection === link.href ? 600 : 400,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action CTAs (Desktop) */}
          <div style={actionsContainerStyle}>
            <Link to="/login" style={loginBtnStyle}>Log in</Link>
            <Link to="/register" className="signup-btn" style={signupBtnStyle}>
              Get Started
              <ArrowRight size={14} style={{ marginLeft: '6px' }} />
            </Link>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button style={menuBtnStyle} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} color="var(--text-primary)" /> : <Menu size={24} color="var(--text-primary)" />}
          </button>
        </div>
      </nav>

      {/* Slide-out Mobile Nav Menu */}
      {isOpen && (
        <div style={mobileMenuOverlayStyle}>
          <div style={mobileLinksContainerStyle}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                style={mobileNavLinkStyle}
              >
                {link.label}
              </a>
            ))}
            <div style={mobileDividerStyle} />
            <Link to="/login" onClick={() => setIsOpen(false)} style={mobileLoginBtnStyle}>Log in</Link>
            <Link to="/register" className="signup-btn" onClick={() => setIsOpen(false)} style={mobileSignupBtnStyle}>
              Get Started
              <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

// Navbar Premium Styles
const navbarStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  zIndex: 1000,
  transition: 'var(--transition-smooth)',
};

const navContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1440px',
  margin: '0 auto',
  padding: '20px 40px',
  height: '80px',
  width: '100%',
};

const logoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.9rem',
  fontWeight: 800,
  lineHeight: 1.1,
  letterSpacing: '0.05em',
  color: 'var(--text-primary)',
  textDecoration: 'none',
};

const linksContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '48px',
};

const navLinkStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  transition: 'var(--transition-smooth)',
};

const actionsContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
};

const loginBtnStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  transition: 'var(--transition-smooth)',
};

const signupBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: 'var(--bg-primary)',
  backgroundColor: 'var(--text-primary)',
  padding: '12px 24px',
  borderRadius: '4px',
  textDecoration: 'none',
  transition: 'var(--transition-smooth)',
};

const menuBtnStyle: React.CSSProperties = {
  display: 'none',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  outline: 'none',
  padding: '4px',
};

const mobileMenuOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: '80px',
  left: 0,
  width: '100%',
  height: 'calc(100vh - 80px)',
  backgroundColor: 'var(--bg-primary)',
  zIndex: 999,
  padding: '40px',
  overflowY: 'auto',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
};

const mobileLinksContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const mobileNavLinkStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
  textDecoration: 'none',
};

const mobileDividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  margin: '16px 0',
};

const mobileLoginBtnStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 400,
  color: 'var(--text-secondary)',
  textDecoration: 'none',
};

const mobileSignupBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--bg-primary)',
  backgroundColor: 'var(--text-primary)',
  padding: '16px',
  borderRadius: '4px',
  textDecoration: 'none',
  textAlign: 'center',
  marginTop: '16px',
};

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @media (max-width: 1024px) {
      .linksContainerStyle, .actionsContainerStyle {
        display: none !important;
      }
      nav > div > div {
        display: none !important;
      }
      nav button {
        display: block !important;
      }
    }
    
    a:not(.signup-btn):hover {
      color: var(--text-primary) !important;
    }
    a.signup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.1) !important;
      color: var(--bg-primary) !important;
    }
  `;
  document.head.appendChild(styleElement);
}
