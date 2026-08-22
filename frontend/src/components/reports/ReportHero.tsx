import React from 'react';

export const ReportHero: React.FC = () => {
  return (
    <div className="report-hero-section">
      <div className="report-hero-left">
        <span className="report-eyebrow">Financial Intelligence / Reports</span>
        <h1 className="report-hero-title">SEE THE STORY<br />BEHIND YOUR MONEY.</h1>
        <p className="report-hero-subtitle">
          Turn your financial activity into clear, actionable reports designed to help you understand where you stand and where you're heading.
        </p>
      </div>
      
      <div className="report-hero-right">
        <div className="report-summary-indicator">
          <div className="summary-indicator-block">
            <span className="summary-indicator-label">Report Period</span>
            <span className="summary-indicator-value" style={{ fontSize: '0.9rem', marginTop: '6px' }}>AUGUST 2026</span>
          </div>
          <div className="summary-indicator-block">
            <span className="summary-indicator-label">Net Cash Flow</span>
            <span className="summary-indicator-value text-emerald">+₹30,800</span>
          </div>
          <div className="summary-indicator-block">
            <span className="summary-indicator-label">Savings Rate</span>
            <span className="summary-indicator-value">36.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
