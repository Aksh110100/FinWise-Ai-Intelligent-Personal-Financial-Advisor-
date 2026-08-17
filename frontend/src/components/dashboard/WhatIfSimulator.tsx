import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const WhatIfSimulator: React.FC = () => {
  const { dashboardData, setSimulatorSavings } = useDashboard();
  const { simulator } = dashboardData;
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (setSimulatorSavings) {
      setSimulatorSavings(sliderValue);
    }
  }, [sliderValue, setSimulatorSavings]);

  const maxVal = simulator.maxIncrement;
  const currentGoalMonths = simulator.currentGoalMonths;
  
  // Simple simulation logic
  const monthsSaved = Math.floor((sliderValue / maxVal) * 5); // saves up to 5 months
  const simulatedMonths = currentGoalMonths - monthsSaved;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>WHAT IF YOU SAVED MORE?</h3>
      
      <div style={cardStyle}>
        <div style={questionStyle}>
          WHAT IF YOU SAVED <span style={{color: 'var(--accent-emerald)'}}>₹{sliderValue.toLocaleString('en-IN')}</span> MORE EACH MONTH?
        </div>

        <div style={sliderContainerStyle}>
          <input 
            type="range" 
            min="0" 
            max={maxVal} 
            step="500"
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={sliderInputStyle}
          />
          <div style={sliderLabelsStyle}>
            <span>₹0</span>
            <span>₹{maxVal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div style={resultsGridStyle}>
          <div style={resultBoxStyle}>
            <span style={resultLabelStyle}>CURRENT GOAL TIME</span>
            <span style={resultValueStyle}>{currentGoalMonths} months</span>
          </div>
          <div style={{...resultBoxStyle, background: 'rgba(99, 181, 138, 0.05)', borderColor: 'rgba(99, 181, 138, 0.2)'}}>
            <span style={{...resultLabelStyle, color: 'var(--accent-emerald)'}}>NEW GOAL TIME</span>
            <span style={{...resultValueStyle, color: 'var(--accent-emerald)'}}>{simulatedMonths} months</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.2rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: 0
};

const cardStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '16px',
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
};

const questionStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  color: 'var(--text-primary)',
  letterSpacing: '0.02em'
};

const sliderContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const sliderInputStyle: React.CSSProperties = {
  width: '100%',
  accentColor: 'var(--accent-emerald)', // Basic style, ideally custom css for range
  height: '4px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '2px',
  outline: 'none',
  WebkitAppearance: 'none',
};

const sliderLabelsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)'
};

const resultsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '2rem',
};

const resultBoxStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const resultLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase'
};

const resultValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2rem',
  color: 'var(--text-primary)'
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: var(--accent-emerald);
      cursor: pointer;
      box-shadow: 0 0 10px rgba(99, 181, 138, 0.5);
    }
  `;
  document.head.appendChild(style);
}
