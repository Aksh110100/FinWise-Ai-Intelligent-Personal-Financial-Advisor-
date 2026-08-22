import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const ReportSnapshot: React.FC = () => {
  return (
    <div className="report-snapshot-container">
      <h3 className="report-section-title" style={{ marginBottom: '16px' }}>YOUR FINANCIAL SNAPSHOT</h3>
      
      <div className="report-snapshot-grid">
        <div className="report-metric-block">
          <span className="metric-block-label">NET INCOME</span>
          <span className="metric-block-value">₹85,000</span>
          <div className="metric-block-trend trend-positive">
            <ArrowUpRight size={14} /> 8.4% from last month
          </div>
        </div>

        <div className="report-metric-block">
          <span className="metric-block-label">TOTAL EXPENSES</span>
          <span className="metric-block-value">₹54,200</span>
          <div className="metric-block-trend trend-neutral">
            <ArrowDownRight size={14} /> 2.1% from last month
          </div>
        </div>

        <div className="report-metric-block">
          <span className="metric-block-label">SAVINGS</span>
          <span className="metric-block-value">₹30,800</span>
          <div className="metric-block-trend trend-positive">
            <ArrowUpRight size={14} /> 12.5% from last month
          </div>
        </div>

        <div className="report-metric-block">
          <span className="metric-block-label">SAVINGS RATE</span>
          <span className="metric-block-value">36.2%</span>
          <div className="metric-block-trend trend-positive">
            <Minus size={14} /> Consistently above 30%
          </div>
        </div>
      </div>
    </div>
  );
};
