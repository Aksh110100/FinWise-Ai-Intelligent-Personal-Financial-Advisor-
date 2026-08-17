import React from 'react';

// A lightweight placeholder component for pages that don't exist yet
export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="dashboard-content-grid">
      <header className="dashboard-header anim-fade-up delay-1">
        <h1 className="header-title">{title.toUpperCase()}</h1>
        <p className="header-subtitle">Module currently in development.</p>
      </header>
      <div className="glass-card anim-fade-up delay-2" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>This is a placeholder for the {title} module.</p>
      </div>
    </div>
  );
};
