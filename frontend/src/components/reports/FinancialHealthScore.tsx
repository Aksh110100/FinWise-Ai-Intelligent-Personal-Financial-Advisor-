import React, { useEffect, useState } from 'react';

export const FinancialHealthScore: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const score = 82;

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="report-section-card">
      <h3 className="report-section-title">FINANCIAL HEALTH</h3>
      
      <div className="health-score-container">
        
        <div className="health-score-ring">
          <svg className="health-score-svg" viewBox="0 0 220 220">
            <circle 
              cx="110" cy="110" r={radius} 
              fill="transparent" 
              stroke="url(#healthGradient)" 
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={animate ? strokeDashoffset : circumference}
              style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C9A46C" />
                <stop offset="100%" stopColor="#63B58A" />
              </linearGradient>
            </defs>
          </svg>
          <span className="health-score-value">{score}</span>
          <span className="health-score-label">STRONG POSITION</span>
        </div>

        <div className="health-metrics-row">
          <div className="health-metric">
            <span className="health-metric-name">Cash Flow</span>
            <span className="health-metric-status text-emerald">Strong</span>
          </div>
          <div className="health-metric">
            <span className="health-metric-name">Savings</span>
            <span className="health-metric-status text-emerald">Good</span>
          </div>
          <div className="health-metric">
            <span className="health-metric-name">Spending</span>
            <span className="health-metric-status text-gold">Moderate</span>
          </div>
          <div className="health-metric">
            <span className="health-metric-name">Goals</span>
            <span className="health-metric-status text-emerald">On Track</span>
          </div>
          <div className="health-metric">
            <span className="health-metric-name">Investments</span>
            <span className="health-metric-status text-emerald">Growing</span>
          </div>
        </div>

      </div>
    </div>
  );
};
