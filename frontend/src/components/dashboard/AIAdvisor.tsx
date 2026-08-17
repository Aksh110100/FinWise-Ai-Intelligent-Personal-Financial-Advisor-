import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AIAdvisorProps {
  suggestions: string[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ suggestions }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-7">
      <h3 style={sectionTitleStyle}>ASK FINWISE</h3>
      
      <div style={inputContainerStyle}>
        <input 
          type="text" 
          placeholder="How can I reach ₹12 lakh in 5 years?" 
          style={inputStyle}
        />
        <button style={btnStyle}>
          <ArrowRight size={20} color="var(--bg-primary)" />
        </button>
      </div>

      <div style={suggestionsContainerStyle}>
        {suggestions.map((suggestion, idx) => (
          <button key={idx} style={suggestionBtnStyle}>
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  marginBottom: '80px',
  background: 'rgba(255, 255, 255, 0.015)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '24px',
  padding: '48px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--accent-gold)',
  marginBottom: '32px',
};

const inputContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '8px 8px 8px 24px',
  marginBottom: '24px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-secondary)',
  fontSize: '1.125rem',
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
  gap: '12px',
};

const suggestionBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  padding: '8px 16px',
  color: 'var(--text-secondary)',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .ai-advisor-input:focus {
      border-color: rgba(201, 164, 108, 0.6) !important;
    }
  `;
  document.head.appendChild(style);
}
