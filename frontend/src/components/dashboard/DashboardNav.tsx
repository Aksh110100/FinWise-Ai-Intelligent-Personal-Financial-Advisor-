import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

export const DashboardNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('finwise_authenticated');
    navigate('/login');
  };

  return (
    <nav style={navStyle} className="dash-anim-element delay-1">
      <div style={logoStyle}>FINWISE<br/>AI</div>
      
      <div style={rightNavStyle}>
        <div style={searchContainerStyle}>
          <Search size={16} color="var(--text-secondary)" />
          <input type="text" placeholder="Ask FinWise..." style={searchInputStyle} />
        </div>
        
        <button style={iconButtonStyle} aria-label="Notifications">
          <Bell size={18} />
          <span style={notificationDotStyle}></span>
        </button>
        
        <button style={iconButtonStyle} aria-label="Profile">
          <User size={18} />
        </button>
        
        <button onClick={handleLogout} style={logoutBtnStyle} className="dashboard-logout-btn">
          LOG OUT
        </button>
      </div>
    </nav>
  );
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 0',
  marginBottom: '64px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const logoStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 800,
  lineHeight: 1.1,
  letterSpacing: '0.05em',
  color: 'var(--text-primary)',
};

const rightNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const searchContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '20px',
  padding: '6px 16px',
  gap: '8px',
};

const searchInputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.875rem',
  outline: 'none',
  width: '180px',
};

const iconButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
  transition: 'color 0.2s',
};

const notificationDotStyle: React.CSSProperties = {
  position: 'absolute',
  top: '4px',
  right: '4px',
  width: '6px',
  height: '6px',
  backgroundColor: 'var(--accent-gold)',
  borderRadius: '50%',
};

const logoutBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: 'var(--text-secondary)',
  padding: '6px 16px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  cursor: 'pointer',
  transition: 'all 0.2s',
};
