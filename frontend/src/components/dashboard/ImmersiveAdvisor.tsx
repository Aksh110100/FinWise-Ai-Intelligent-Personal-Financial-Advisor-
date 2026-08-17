import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { ArrowRight } from 'lucide-react';

export const ImmersiveAdvisor: React.FC = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section id="advisor" className="cinematic-section" ref={targetRef}>
      <div className={`section-divider ${isIntersecting ? 'visible delay-1' : ''}`}>
        <span>ASK FINWISE AI</span>
      </div>

      <div style={containerStyle} className={`anim-fade-up ${isIntersecting ? 'visible delay-2' : ''}`}>
        <div style={glassPromptStyle}>
          <h2 style={promptTitleStyle}>What should I change this month?</h2>
          
          <div style={inputContainerStyle}>
            <input 
              type="text" 
              placeholder="Ask anything about your money..." 
              style={inputStyle}
            />
            <button style={btnStyle} aria-label="Submit">
              <ArrowRight size={20} color="var(--bg-primary)" />
            </button>
          </div>

          <div style={suggestionsContainerStyle}>
            <span style={suggestionStyle}>Can I afford a new laptop?</span>
            <span style={suggestionStyle}>How much should I invest?</span>
            <span style={suggestionStyle}>Where am I overspending?</span>
            <span style={suggestionStyle}>How do I reach ₹12L faster?</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  paddingTop: '60px',
  display: 'flex',
  justifyContent: 'center',
};

const glassPromptStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '700px',
  background: 'rgba(255, 255, 255, 0.025)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  padding: '56px 48px',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const promptTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
  fontWeight: 400,
  color: 'var(--text-primary)',
  textAlign: 'center',
};

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '8px 8px 8px 24px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
};

const btnStyle: React.CSSProperties = {
  background: 'var(--text-primary)',
  border: 'none',
  borderRadius: '8px',
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
};

const suggestionsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  justifyContent: 'center',
};

const suggestionStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'color 0.2s',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .immersive-advisor-input:focus {
      border-color: rgba(201, 164, 108, 0.5) !important;
    }
  `;
  document.head.appendChild(style);
}
