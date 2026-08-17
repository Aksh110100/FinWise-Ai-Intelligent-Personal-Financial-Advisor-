import React from 'react';
import { AnimatedNumber } from '../dashboard/AnimatedNumber';

export const InvestmentOverview: React.FC = () => {
  // Simplified static SVG for investment sparkline
  const sparklinePath = "M 0 40 Q 20 30 40 35 T 80 20 T 120 25 T 160 5 T 200 10";

  return (
    <div className="glass-card inv-card anim-fade-up delay-11">
      <h3 className="card-title">INVESTMENT OVERVIEW</h3>
      
      <div className="inv-stats">
        <div className="inv-stat">
          <span className="inv-label">Current</span>
          <span className="inv-val"><AnimatedNumber value="₹2,40,000" trigger={true} /></span>
        </div>
        <div className="inv-stat">
          <span className="inv-label">Returns</span>
          <span className="inv-val positive">+₹28,400</span>
        </div>
        <div className="inv-stat">
          <span className="inv-label">Return %</span>
          <span className="inv-val positive">+11.8%</span>
        </div>
      </div>

      <div className="inv-sparkline">
        <svg viewBox="0 0 200 50" preserveAspectRatio="none" width="100%" height="50">
          <path d={sparklinePath} fill="none" stroke="var(--accent-gold)" strokeWidth="2" className="svg-draw-line" />
          {/* Gradient fill under line */}
          <path d={`${sparklinePath} L 200 50 L 0 50 Z`} fill="url(#invGrad)" opacity="0.2" />
          <defs>
            <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-gold)" />
              <stop offset="100%" stopColor="rgba(201, 164, 108, 0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="inv-portfolio">
        <h4 className="portfolio-title">PORTFOLIO</h4>
        <div className="portfolio-bars">
          <div className="p-bar-item">
            <span>Equity</span>
            <div className="p-bar-bg"><div className="p-bar-fill svg-draw-progress" style={{ width: '60%', backgroundColor: 'var(--text-primary)' }}></div></div>
          </div>
          <div className="p-bar-item">
            <span>Debt</span>
            <div className="p-bar-bg"><div className="p-bar-fill svg-draw-progress" style={{ width: '25%', backgroundColor: 'var(--text-secondary)' }}></div></div>
          </div>
          <div className="p-bar-item">
            <span>Gold</span>
            <div className="p-bar-bg"><div className="p-bar-fill svg-draw-progress" style={{ width: '10%', backgroundColor: 'var(--accent-gold)' }}></div></div>
          </div>
          <div className="p-bar-item">
            <span>Cash</span>
            <div className="p-bar-bg"><div className="p-bar-fill svg-draw-progress" style={{ width: '5%', backgroundColor: 'var(--text-positive)' }}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};
