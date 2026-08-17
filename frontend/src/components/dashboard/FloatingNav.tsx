import React, { useEffect, useState } from 'react';
import { Search, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FloatingNav: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('finwise_authenticated');
    navigate('/login');
  };

  return (
    <nav className={`floating-nav ${scrolled ? 'scrolled' : ''}`}>
      <div style={logoStyle}>FINWISE<br/>AI</div>
      
      <div className="nav-links">
        <button onClick={() => handleScrollTo('overview')} style={linkStyle}>Overview</button>
        <button onClick={() => handleScrollTo('money')} style={linkStyle}>Money</button>
        <button onClick={() => handleScrollTo('insights')} style={linkStyle}>Insights</button>
        <button onClick={() => handleScrollTo('goals')} style={linkStyle}>Goals</button>
        <button onClick={() => handleScrollTo('advisor')} style={linkStyle}>Advisor</button>
      </div>
      
      <div style={rightNavStyle}>
        <button style={iconButtonStyle} aria-label="Search"><Search size={18} /></button>
        <button style={iconButtonStyle} aria-label="Notifications"><Bell size={18} /></button>
        <button style={iconButtonStyle} onClick={handleLogout} aria-label="Profile" title="Logout"><User size={18} /></button>
      </div>
    </nav>
  );
};

const logoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '0.05em',
  color: 'var(--text-primary)',
  lineHeight: 1.1,
};

const rightNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const iconButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  display: 'flex',
  transition: 'color 0.2s',
};

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'color 0.2s',
};
