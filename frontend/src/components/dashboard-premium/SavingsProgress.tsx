import React from 'react';
import { AnimatedNumber } from '../dashboard/AnimatedNumber';

export const SavingsProgress: React.FC = () => {
  return (
    <div className="glass-card savings-card anim-fade-up delay-10">
      <h3 className="card-title">SAVINGS GOAL</h3>
      
      <div className="savings-amounts">
        <span className="savings-current"><AnimatedNumber value="₹18,500" trigger={true} /></span>
        <span className="savings-target">/ ₹25,000</span>
      </div>

      <div className="savings-progress-bar">
        <div className="progress-fill svg-draw-progress" style={{ width: '74%' }}></div>
      </div>
      
      <div className="savings-pct">74%</div>
    </div>
  );
};
