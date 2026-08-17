import React from 'react';
import { AnimatedNumber } from '../dashboard/AnimatedNumber'; // Reuse our custom animated number

interface KPIGridProps {
  data: {
    monthlyIncome: string;
    monthlyExpenses: string;
    monthlySaved: string;
    currentBalance: string;
  };
}

export const KPIGrid: React.FC<KPIGridProps> = ({ data }) => {
  return (
    <div className="kpi-grid">
      <KPICard 
        title="TOTAL BALANCE" 
        value={data.currentBalance} 
        trend="+8.4%" 
        isPositive={true} 
        delay="delay-2" 
        sparklineData={[10, 25, 20, 45, 30, 60, 50]} 
        color="var(--accent-gold)"
      />
      <KPICard 
        title="TOTAL INCOME" 
        value={data.monthlyIncome} 
        trend="+5.2%" 
        isPositive={true} 
        delay="delay-3" 
        sparklineData={[20, 20, 25, 25, 40, 40, 50]} 
        color="var(--text-primary)"
      />
      <KPICard 
        title="TOTAL EXPENSES" 
        value={data.monthlyExpenses} 
        trend="-7.3%" 
        isPositive={false} 
        delay="delay-4" 
        sparklineData={[50, 40, 45, 30, 20, 25, 10]} 
        color="var(--text-positive)" // Negative expenses is positive health
      />
      <KPICard 
        title="SAVINGS" 
        value={data.monthlySaved} 
        trend="72% OF GOAL" 
        isPositive={true} 
        delay="delay-5" 
        sparklineData={[10, 15, 25, 35, 45, 50, 60]} 
        color="var(--text-secondary)"
      />
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  delay: string;
  sparklineData: number[];
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, isPositive, delay, sparklineData, color }) => {
  // Generate SVG path for sparkline
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;
  const height = 30;
  const width = 100;
  
  const points = sparklineData.map((d, i) => {
    const x = (i / (sparklineData.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' L ');

  const pathD = `M ${points}`;

  return (
    <div className={`glass-card kpi-card anim-fade-up ${delay}`}>
      <div className="kpi-header">
        <h3 className="kpi-title">{title}</h3>
        <span className={`kpi-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>{trend}</span>
      </div>
      <div className="kpi-value">
        <AnimatedNumber value={value} trigger={true} duration={1500} />
      </div>
      <div className="kpi-sparkline">
        <svg width="100%" height="30" viewBox="0 0 100 30" preserveAspectRatio="none">
          <path 
            d={pathD} 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            className="svg-draw-line"
          />
        </svg>
      </div>
    </div>
  );
};
