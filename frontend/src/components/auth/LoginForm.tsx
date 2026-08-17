import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  isAnimatingOut: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ isAnimatingOut }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // No backend logic, immediately route to dashboard
    setTimeout(() => {
      localStorage.setItem('finwise_authenticated', 'true');
      navigate('/dashboard');
    }, 400);
  };

  const getAnimClass = (delay: number) => {
    return `auth-anim-element delay-${delay} ${isAnimatingOut ? 'exit' : ''}`;
  };

  return (
    <>
      <h2 style={formTitleStyle} className={getAnimClass(1)}>WELCOME BACK</h2>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle} className={getAnimClass(2)}>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} 
            autoComplete="email"
          />
        </div>

        <div style={inputGroupStyle} className={getAnimClass(3)}>
          <label style={labelStyle} htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{...inputStyle, paddingRight: '48px'}} 
              autoComplete="current-password"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={eyeButtonStyle}
            >
              {showPassword ? <EyeOff size={20} color="var(--text-secondary)" /> : <Eye size={20} color="var(--text-secondary)" />}
            </button>
          </div>
        </div>

        {error && <div style={errorStyle} className={getAnimClass(4)}>{error}</div>}

        <div style={formOptionsStyle} className={getAnimClass(4)}>
          <label style={checkboxLabelStyle}>
            <input type="checkbox" style={checkboxStyle} />
            Remember me
          </label>
          <a href="#" style={forgotStyle}>Forgot password?</a>
        </div>

        <button type="submit" style={submitBtnStyle} className={`login-submit-btn ${getAnimClass(5)}`} disabled={isLoading}>
          {isLoading ? 'SIGNING IN...' : 'LOG IN →'}
        </button>
      </form>

      <div style={footerStyle} className={getAnimClass(6)}>
        Don't have an account? <Link to="/register" style={linkStyle}>Create account</Link>
      </div>
    </>
  );
};

// Extracted form styles
const formTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: '32px',
  letterSpacing: '0.02em',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  background: 'rgba(255, 255, 255, 0.035)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
  borderRadius: '8px',
  padding: '0 16px',
  color: '#F5F3EF',
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const eyeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const errorStyle: React.CSSProperties = {
  color: '#f43f5e',
  fontSize: '0.875rem',
  marginTop: '-16px',
};

const formOptionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.875rem',
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
};

const checkboxStyle: React.CSSProperties = {
  accentColor: 'var(--accent-gold)',
  width: '16px',
  height: '16px',
};

const forgotStyle: React.CSSProperties = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

const submitBtnStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  background: '#F5F3EF',
  color: '#050505',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  fontFamily: 'var(--font-secondary)',
  cursor: 'pointer',
  marginTop: '8px',
  transition: 'opacity 0.2s, transform 0.2s',
};

const footerStyle: React.CSSProperties = {
  marginTop: '32px',
  textAlign: 'center',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
};

const linkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontWeight: 500,
};
