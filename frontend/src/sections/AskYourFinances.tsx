import React, { useState } from 'react';

export const AskYourFinances: React.FC = () => {
  const [activePrompt, setActivePrompt] = useState<number | null>(null);

  const prompts = [
    {
      q: "Can I afford a new laptop?",
      a: "Yes. You have ₹85,000 in your flexible savings. A new laptop for ₹60,000 keeps you above your minimum buffer limit."
    },
    {
      q: "How much should I save this month?",
      a: "Based on your recent utility bills spike, aim for ₹18,000 this month (₹2,000 less than usual) to accommodate the extra expenses safely."
    },
    {
      q: "Am I spending too much?",
      a: "Your food delivery spending is up 34% this month. Cutting this back could free up an additional ₹4,500 for your emergency fund."
    },
    {
      q: "How much should I invest?",
      a: "You have ₹25,000 surplus this month. We recommend allocating ₹15,000 to your index funds and holding ₹10,000 in liquid savings."
    },
    {
      q: "Can I reach my ₹10L goal?",
      a: "Yes. At your current savings rate of ₹22,000/month plus an expected 8% return, you will hit ₹10L in exactly 38 months."
    }
  ];

  return (
    <section id="ask-finances" style={sectionStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>TALK TO YOUR MONEY.</h2>
        
        <div style={contentGridStyle}>
          <div style={promptsColumnStyle}>
            {prompts.map((p, i) => (
              <button 
                key={i}
                style={{
                  ...promptButtonStyle,
                  backgroundColor: activePrompt === i ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderColor: activePrompt === i ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  color: activePrompt === i ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
                onClick={() => setActivePrompt(i)}
              >
                {p.q}
              </button>
            ))}
          </div>

          <div style={responseColumnStyle}>
            {activePrompt !== null ? (
              <div style={responseCardStyle}>
                <div style={responseHeaderStyle}>FINWISE AI RESPONSE</div>
                <div style={responseTextStyle}>{prompts[activePrompt].a}</div>
              </div>
            ) : (
              <div style={{...responseCardStyle, opacity: 0.3, alignItems: 'center', justifyContent: 'center'}}>
                <div style={responseTextStyle}>Select a question to see how FinWise AI understands your financial reality.</div>
              </div>
            )}
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
  display: 'flex',
  flexDirection: 'column',
  gap: '64px',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const contentGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '64px',
};

const promptsColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const promptButtonStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '20px 24px',
  borderRadius: '8px',
  border: '1px solid',
  fontSize: '1.125rem',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)',
  outline: 'none',
};

const responseColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const responseCardStyle: React.CSSProperties = {
  backgroundColor: '#111111',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '8px',
  padding: '40px',
  minHeight: '250px',
  display: 'flex',
  flexDirection: 'column',
  transition: 'opacity 0.3s ease',
};

const responseHeaderStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'var(--accent-gold)',
  marginBottom: '24px',
};

const responseTextStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  lineHeight: '1.6',
  color: 'var(--text-primary)',
};

if (typeof window !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @media (max-width: 1024px) {
      #ask-finances .contentGridStyle {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(styleElement);
}
