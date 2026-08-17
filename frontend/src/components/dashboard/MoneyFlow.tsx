import React from 'react';
import { ArrowDown } from 'lucide-react';

export const MoneyFlow: React.FC = () => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-4">
      <h3 style={sectionTitleStyle}>MONEY FLOW</h3>
      
      <div style={flowContainerStyle}>
        <FlowItem label="Income" />
        <FlowArrow />
        <FlowItem label="Expenses" />
        <FlowArrow />
        <FlowItem label="Savings" />
        <FlowArrow />
        <FlowItem label="Investments" />
        <FlowArrow />
        <FlowItem label="Future Wealth" isFinal />
      </div>
    </section>
  );
};

const FlowItem: React.FC<{label: string, isFinal?: boolean}> = ({ label, isFinal }) => (
  <div style={{...itemStyle, color: isFinal ? 'var(--accent-gold)' : 'var(--text-primary)'}}>
    {label}
  </div>
);

const FlowArrow: React.FC = () => (
  <div style={arrowStyle}>
    <ArrowDown size={20} color="var(--text-secondary)" opacity={0.5} />
  </div>
);

// Styles
const containerStyle: React.CSSProperties = {
  marginBottom: '80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
  marginBottom: '48px',
};

const flowContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
};

const itemStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2rem',
  fontWeight: 500,
  letterSpacing: '-0.02em',
};

const arrowStyle: React.CSSProperties = {
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
