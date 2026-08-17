import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIAdvisorPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="glass-card ai-prompt-card anim-fade-up delay-13">
      <div className="prompt-header">
        <h3 className="card-title">ASK FINWISE AI</h3>
        <p className="prompt-subtitle">What should I do with my money this month?</p>
      </div>

      <div className="prompt-input-wrapper">
        <input 
          type="text" 
          className="prompt-input" 
          placeholder="Ask FinWise..." 
        />
        <button 
          className="prompt-submit" 
          onClick={() => navigate('/advisor')}
          aria-label="Submit"
        >
          <ArrowRight size={18} color="#050505" />
        </button>
      </div>

      <div className="prompt-suggestions">
        <span className="suggestion-pill" onClick={() => navigate('/advisor')}>How can I save more?</span>
        <span className="suggestion-pill" onClick={() => navigate('/advisor')}>Can I afford this purchase?</span>
        <span className="suggestion-pill" onClick={() => navigate('/advisor')}>How much should I invest?</span>
        <span className="suggestion-pill" onClick={() => navigate('/advisor')}>How can I reach my goal faster?</span>
      </div>
    </div>
  );
};
