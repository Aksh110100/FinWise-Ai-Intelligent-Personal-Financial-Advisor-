import React, { useEffect, useState } from 'react';

export const SavingsAndGoals: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const savingsTarget = 40000;
  const currentSavings = 30800;
  const percent = Math.round((currentSavings / savingsTarget) * 100);
  
  // Circle math
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="report-two-col savings-goals-grid">
      <div className="report-section-card">
        <h3 className="report-section-title">SAVINGS PROGRESS</h3>
        
        <div className="savings-progress-circle-container">
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            <circle 
              cx="80" cy="80" r={radius} 
              fill="transparent" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="12" 
            />
            <circle 
              cx="80" cy="80" r={radius} 
              fill="transparent" 
              stroke="var(--text-positive)" 
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={animate ? strokeDashoffset : circumference}
              style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="savings-circle-text">
            <span className="savings-circle-value">{percent}%</span>
            <span className="savings-circle-label">Achieved</span>
          </div>
        </div>
        
        <div className="savings-remaining">
          <span style={{ color: 'var(--text-primary)' }}>₹{(savingsTarget - currentSavings).toLocaleString('en-IN')}</span> remaining to target
        </div>
      </div>

      <div className="report-section-card">
        <h3 className="report-section-title">GOAL MOMENTUM</h3>
        
        <div className="goal-momentum-list">
          
          <div className="goal-momentum-item">
            <div className="goal-momentum-header">
              <span>Emergency Fund</span>
              <span style={{ color: 'var(--text-positive)' }}>68%</span>
            </div>
            <div className="expense-cat-bar-bg" style={{ height: '3px' }}>
              <div 
                className="expense-cat-bar-fill" 
                style={{ 
                  width: animate ? '68%' : '0%', 
                  background: 'var(--text-positive)',
                  transitionDelay: '200ms'
                }} 
              />
            </div>
          </div>

          <div className="goal-momentum-item">
            <div className="goal-momentum-header">
              <span>Travel Fund</span>
              <span style={{ color: 'var(--text-positive)' }}>81%</span>
            </div>
            <div className="expense-cat-bar-bg" style={{ height: '3px' }}>
              <div 
                className="expense-cat-bar-fill" 
                style={{ 
                  width: animate ? '81%' : '0%', 
                  background: 'var(--text-positive)',
                  transitionDelay: '300ms'
                }} 
              />
            </div>
          </div>

          <div className="goal-momentum-item">
            <div className="goal-momentum-header">
              <span>New Laptop</span>
              <span style={{ color: 'var(--text-secondary)' }}>42%</span>
            </div>
            <div className="expense-cat-bar-bg" style={{ height: '3px' }}>
              <div 
                className="expense-cat-bar-fill" 
                style={{ 
                  width: animate ? '42%' : '0%', 
                  background: 'var(--text-secondary)',
                  transitionDelay: '400ms'
                }} 
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
