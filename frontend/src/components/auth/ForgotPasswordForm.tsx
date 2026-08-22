import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface ForgotPasswordFormProps {
  isAnimatingOut: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ isAnimatingOut }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  const getAnimClass = (delay: number) => {
    return `auth-anim-element delay-${delay} ${isAnimatingOut ? 'exit' : ''}`;
  };

  if (isSuccess) {
    return (
      <div style={successContainerStyle}>
        <div style={checkCircleStyle} className={getAnimClass(1)}>
          <Check size={32} color="var(--accent-gold)" />
        </div>
        <h2 style={formTitleStyle} className={getAnimClass(2)}>CHECK YOUR EMAIL</h2>
        <p style={{...descStyle, marginBottom: '24px'}} className={getAnimClass(3)}>
          If an account exists for this email, we've sent instructions to reset your password.
        </p>
        <div style={emailDisplayBoxStyle} className={getAnimClass(4)}>
          {email}
        </div>
        <Link to="/login" style={{...submitBtnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}} className={`login-submit-btn ${getAnimClass(5)}`}>
          BACK TO LOGIN →
        </Link>
        <div style={footerStyle} className={getAnimClass(6)}>
          Didn't receive it? <button onClick={() => setIsSuccess(false)} style={linkButtonStyle} className="nav-signup-btn">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={eyebrowStyle} className={getAnimClass(1)}>ACCOUNT RECOVERY</div>
      <h2 style={formTitleStyle} className={getAnimClass(2)}>FORGOT<br/>PASSWORD?</h2>
      <p style={descStyle} className={getAnimClass(3)}>
        Enter the email associated with your FinWise AI account and we'll help you get back in.
      </p>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={inputGroupStyle} className={getAnimClass(4)}>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} 
            placeholder="Enter your email address"
            autoComplete="email"
          />
        </div>

        {error && <div style={errorStyle} className={getAnimClass(5)}>{error}</div>}

        <button type="submit" style={submitBtnStyle} className={`login-submit-btn ${getAnimClass(6)}`} disabled={isLoading}>
          {isLoading ? 'SENDING...' : 'SEND RESET LINK →'}
        </button>
      </form>

      <div style={footerStyle} className={getAnimClass(7)}>
        Remember your password? <Link to="/login" style={linkStyle}>Back to login</Link>
      </div>
    </>
  );
};

// Extracted form styles
const eyebrowStyle: React.CSSProperties = {
  color: 'var(--accent-gold)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  marginBottom: '16px',
  fontFamily: 'var(--font-secondary)',
};

const formTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: 'var(--text-primary)',
  marginBottom: '16px',
  letterSpacing: '0.02em',
  lineHeight: 1.2,
};

const descStyle: React.CSSProperties = {
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  color: 'var(--text-secondary)',
  marginBottom: '32px',
  fontFamily: 'var(--font-secondary)',
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
  fontFamily: 'var(--font-secondary)',
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
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const errorStyle: React.CSSProperties = {
  color: '#f43f5e',
  fontSize: '0.875rem',
  marginTop: '-16px',
  fontFamily: 'var(--font-secondary)',
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
  textDecoration: 'none',
};

const footerStyle: React.CSSProperties = {
  marginTop: '32px',
  textAlign: 'center',
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-secondary)',
};

const linkStyle: React.CSSProperties = {
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontWeight: 500,
  transition: 'color 0.2s',
};

const linkButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.875rem',
  transition: 'color 0.2s',
};

// Success state styles
const successContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

const checkCircleStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  border: '2px solid rgba(201, 164, 108, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  boxShadow: '0 0 20px rgba(201, 164, 108, 0.15)',
};

const emailDisplayBoxStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  padding: '12px 24px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-secondary)',
  fontWeight: 500,
  marginBottom: '32px',
  width: '100%',
};
