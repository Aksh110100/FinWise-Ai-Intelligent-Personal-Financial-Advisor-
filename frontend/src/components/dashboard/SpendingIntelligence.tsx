import React from 'react';

interface Category {
  category: string;
  amount: string;
  percentage: number;
}

interface SpendingIntelligenceProps {
  categories: Category[];
}

export const SpendingIntelligence: React.FC<SpendingIntelligenceProps> = ({ categories }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-5">
      <h3 style={sectionTitleStyle}>WHERE YOUR MONEY GOES</h3>
      
      <div style={listStyle}>
        {categories.map((cat, idx) => (
          <div key={idx} style={itemContainerStyle}>
            <div style={headerStyle}>
              <span style={labelStyle}>{cat.category}</span>
              <span style={amountStyle}>{cat.amount}</span>
            </div>
            <div style={barContainerStyle}>
              <div style={{...barFillStyle, width: `${cat.percentage}%`}} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  marginBottom: '80px',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
  marginBottom: '48px',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
};

const itemContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
};

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: 'var(--text-primary)',
};

const amountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  color: 'var(--text-secondary)',
};

const barContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '2px',
  background: 'rgba(255, 255, 255, 0.05)',
  position: 'relative',
};

const barFillStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  background: 'var(--text-primary)',
  transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)',
};
