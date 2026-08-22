import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('finwise_authenticated') === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    // Simulate network request for frontend demo
    setTimeout(() => {
      localStorage.setItem('finwise_authenticated', 'true');
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div style={pageStyle}>
      <img 
        src="/financial-frames/frame_000100.jpg" 
        alt="Financial Background" 
        style={bgStyle} 
      />
      
      <div style={containerStyle}>
        <div style={leftColStyle}>
          <div style={logoStyle}>
            <img src="/logo.png" alt="FinWise AI" style={{ height: '90px', objectFit: 'contain', marginLeft: '-12px', marginBottom: '-12px' }} />
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

        <div style={rightColStyle}>
          <div style={glassPanelStyle}>
            <h2 style={formTitleStyle}>WELCOME BACK</h2>
            
            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={inputGroupStyle}>
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

              <div style={inputGroupStyle}>
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

              {error && <div style={errorStyle}>{error}</div>}

              <div style={formOptionsStyle}>
                <label style={checkboxLabelStyle}>
                  <input type="checkbox" style={checkboxStyle} />
                  Remember me
                </label>
                <a href="#" style={forgotStyle}>Forgot password?</a>
              </div>

              <button type="submit" style={submitBtnStyle} className="login-submit-btn" disabled={isLoading}>
                {isLoading ? 'SIGNING IN...' : 'LOG IN →'}
              </button>
            </form>

            <div style={footerStyle}>
              Don't have an account? <Link to="/register" style={linkStyle}>Create account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
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
};

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

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    input[type="email"]:focus, input[type="password"]:focus, input[type="text"]:focus {
      border-color: rgba(201, 164, 108, 0.65) !important;
    }
    .login-submit-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    a:hover {
      color: var(--text-primary) !important;
    }
    @media (max-width: 768px) {
      .login-container {
        flex-direction: column !important;
        padding: 20px !important;
        gap: 40px !important;
      }
      .login-left-col, .login-right-col {
        width: 100% !important;
        text-align: center !important;
      }
      .login-logo {
        margin-bottom: 32px !important;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Apply responsive class names to inline styles
  containerStyle.className = 'login-container';
  leftColStyle.className = 'login-left-col';
  rightColStyle.className = 'login-right-col';
  logoStyle.className = 'login-logo';
}

export default Login;
