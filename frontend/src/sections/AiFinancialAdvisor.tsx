import React, { useState } from 'react';

export const AiFinancialAdvisor: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: 'user', text: 'Can I invest ₹10,000 this month?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Simulate initial interaction on mount
  React.useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([
        { role: 'user', text: 'Can I invest ₹10,000 this month?' },
        { role: 'ai', text: 'Based on your current cash flow, yes. You can invest ₹10,000 while maintaining your recommended emergency buffer.' }
      ]);
      setIsTyping(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    const el = document.getElementById('ai-advisor');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="ai-advisor" style={{
      ...sectionStyle,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
    }}>
      <div style={containerStyle}>
        <div style={textContainerStyle}>
          <h2 style={titleStyle}>YOUR FINANCIAL ADVISOR.<br/>WITHOUT THE APPOINTMENT.</h2>
          <div style={chatContainerStyle}>
            {messages.map((m, i) => (
              <div key={i} style={{
                ...messageStyle,
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: m.role === 'user' ? '#1A1A1A' : 'transparent',
                borderLeft: m.role === 'ai' ? '2px solid var(--accent-gold)' : 'none',
                paddingLeft: m.role === 'ai' ? '16px' : '20px',
                color: m.role === 'ai' ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}>
                <span style={roleStyle}>{m.role === 'user' ? 'YOU' : 'FINWISE AI'}</span>
                <p style={messageTextStyle}>{m.text}</p>
              </div>
            ))}
            {isTyping && (
              <div style={{...messageStyle, alignSelf: 'flex-start', borderLeft: '2px solid var(--accent-gold)', paddingLeft: '16px'}}>
                <span style={roleStyle}>FINWISE AI</span>
                <div style={typingDotStyle}></div>
              </div>
            )}
          </div>
        </div>

        <div style={visualContainerStyle}>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>RECOMMENDED INVESTMENT</div>
            <div style={cardValueStyle}>₹10,000 <span style={cardSubStyle}>/ MONTH</span></div>
            <div style={dividerStyle}></div>
            <div style={cardHeaderStyle}>PROJECTED 5-YEAR IMPACT</div>
            <div style={graphContainerStyle}>
              {/* Minimal line graph representation */}
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" style={{width: '100%', height: '100%', overflow: 'visible'}}>
                <path d="M0,50 Q25,45 50,30 T100,0" fill="none" stroke="var(--accent-emerald)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                <circle cx="100" cy="0" r="4" fill="var(--accent-emerald)" />
              </svg>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.75rem'}}>
              <span>TODAY</span>
              <span>+₹8.5L</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const sectionStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 40px',
  backgroundColor: 'transparent',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '1200px',
  width: '100%',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '80px',
  alignItems: 'center',
};

const textContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
  fontWeight: 800,
  lineHeight: 1.1,
  color: 'var(--text-primary)',
};

const chatContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const messageStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '20px',
  borderRadius: '4px',
  maxWidth: '85%',
};

const roleStyle: React.CSSProperties = {
  fontSize: '0.675rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
};

const messageTextStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  lineHeight: '1.6',
};

const typingDotStyle: React.CSSProperties = {
  width: '8px',
  height: '8px',
  backgroundColor: 'var(--accent-gold)',
  borderRadius: '50%',
  animation: 'pulse 1.5s infinite',
};

const visualContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  padding: '40px',
  borderRadius: '8px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
};

const cardHeaderStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--text-muted)',
  marginBottom: '12px',
};

const cardValueStyle: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: 'var(--accent-emerald)',
  fontFamily: 'var(--font-primary)',
};

const cardSubStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  fontWeight: 400,
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  margin: '32px 0',
};

const graphContainerStyle: React.CSSProperties = {
  height: '150px',
  width: '100%',
  marginTop: '24px',
};
