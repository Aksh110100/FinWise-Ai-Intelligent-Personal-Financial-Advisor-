import React from 'react';

interface FinancialHeroProps {
  userName: string;
  balance: string;
  income: string;
  expenses: string;
  saved: string;
  invested: string;
}

export const FinancialHero: React.FC<FinancialHeroProps> = ({
  userName,
  balance,
  income,
  expenses,
  saved,
  invested
}) => {
  return (
    <section style={heroStyle} className="dash-anim-element delay-2">
      <div style={greetingContainerStyle}>
        <h2 style={greetingStyle}>GOOD MORNING, {userName.toUpperCase()}.</h2>
        <p style={subGreetingStyle}>
          YOUR MONEY IS<br />
          MOVING IN THE<br />
          RIGHT DIRECTION.
        </p>
      </div>

      <div style={balanceContainerStyle}>
        <h1 style={balanceAmountStyle}>{balance}</h1>
        <div style={balanceLabelStyle}>CURRENT MONTHLY BALANCE</div>
      </div>

      <div style={metricsGridStyle}>
        <Metric label="Income" value={income} />
        <Metric label="Expenses" value={expenses} />
        <Metric label="Saved" value={saved} />
        <Metric label="Invested" value={invested} />
      </div>
    </section>
  );
};

const Metric: React.FC<{label: string, value: string}> = ({ label, value }) => (
  <div style={metricStyle}>
    <div style={metricLabelStyle}>{label}</div>
    <div style={metricValueStyle}>{value}</div>
  </div>
);

// Styles
const heroStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '64px',
  marginBottom: '80px',
};

const greetingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const greetingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.25rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  color: 'var(--text-secondary)',
};

const subGreetingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
  fontWeight: 600,
  lineHeight: 1.05,
  letterSpacing: '-0.02em',
  color: 'var(--text-primary)',
};

const balanceContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const balanceAmountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(4rem, 8vw, 7rem)',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color: 'var(--accent-gold)',
};

const balanceLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
};

const metricsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '32px',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  paddingTop: '32px',
};

const metricStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: 'var(--text-secondary)',
};

const metricValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.5rem',
  fontWeight: 500,
  color: 'var(--text-primary)',
};
