import React from 'react';
import { AnimatedNumber } from '../dashboard/AnimatedNumber';

interface GoalListProps {
  goals: {
    name: string;
    current: string;
    target: string;
  }[];
}

export const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  return (
    <div className="glass-card goals-card anim-fade-up delay-12">
      <h3 className="card-title">FINANCIAL GOALS</h3>
      
      <div className="goals-list">
        {goals.map((goal, idx) => {
          // Calculate percentage from string values (e.g., "₹80,000" / "₹1,00,000")
          const curVal = parseFloat(goal.current.replace(/[^\d.]/g, ''));
          const tgtVal = parseFloat(goal.target.replace(/[^\d.]/g, ''));
          const pct = Math.min(100, Math.round((curVal / tgtVal) * 100));

          return (
            <div key={idx} className="goal-item">
              <div className="goal-header">
                <span className="goal-name">{goal.name}</span>
                <span className="goal-pct">{pct}%</span>
              </div>
              <div className="goal-amounts">
                <span className="goal-current"><AnimatedNumber value={goal.current} trigger={true} /></span>
                <span className="goal-target">/ {goal.target}</span>
              </div>
              <div className="goal-bar-bg">
                <div 
                  className="goal-bar-fill svg-draw-progress" 
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
