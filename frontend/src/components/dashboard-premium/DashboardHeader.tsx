import React from 'react';

export const DashboardHeader: React.FC<{ userName: string }> = ({ userName }) => {
  return (
    <header className="dashboard-header anim-fade-up delay-1">
      <div className="header-titles">
        <h1 className="header-title">GOOD MORNING, {userName.toUpperCase()}.</h1>
        <p className="header-subtitle">FINANCIAL OVERVIEW</p>
        <p className="header-subtext">Your money at a glance.</p>
      </div>
      <div className="header-date">
        <span className="date-month">AUGUST 2026</span>
        <span className="date-badge">THIS MONTH</span>
      </div>
    </header>
  );
};
