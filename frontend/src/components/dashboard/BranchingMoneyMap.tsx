import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface BranchingMoneyMapProps {
  total: string;
  categories: { category: string; amount: string; percentage: number }[];
}

export const BranchingMoneyMap: React.FC<BranchingMoneyMapProps> = ({ total, categories }) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="cinematic-section" ref={targetRef}>
      <div className={`section-divider ${isIntersecting ? 'visible delay-1' : ''}`}>
        <span>WHERE YOUR MONEY GOES</span>
      </div>

      <div style={containerStyle}>
        <div style={centerNodeStyle} className={`anim-fade-up ${isIntersecting ? 'visible delay-2' : ''}`}>
          <div style={centerAmountStyle}>{total}</div>
          <div style={centerLabelStyle}>MONTHLY SPENDING</div>
        </div>
        
        <div style={branchesContainerStyle}>
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              style={branchItemStyle} 
              className={`anim-fade-up ${isIntersecting ? `visible delay-${(idx + 3)}` : ''}`}
            >
              <div style={branchLineStyle}></div>
              <div style={branchContentStyle}>
                <span style={catNameStyle}>{cat.category}</span>
                <span style={catAmountStyle}>{cat.amount}</span>
                <span style={catPercentStyle}>{cat.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  paddingTop: '60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '40px',
};

const centerNodeStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const centerAmountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2.5rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
};

const centerLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
};

const branchesContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '600px',
  gap: '24px',
};

const branchItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const branchLineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  background: 'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.15) 100%)',
};

const branchContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '16px',
  minWidth: '240px',
};

const catNameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
  width: '120px',
};

const catAmountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-secondary)',
  width: '80px',
  textAlign: 'right',
};

const catPercentStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--accent-gold)',
  width: '40px',
  textAlign: 'right',
};
