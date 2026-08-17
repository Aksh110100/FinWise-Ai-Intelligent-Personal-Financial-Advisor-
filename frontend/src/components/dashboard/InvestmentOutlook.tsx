import React from 'react';

interface InvestmentOutlookProps {
  outlook: {
    monthlyInvestable: string;
    riskProfile: string;
    allocation: { name: string; percentage: number }[];
  };
}

export const InvestmentOutlook: React.FC<InvestmentOutlookProps> = ({ outlook }) => {
  return (
    <section style={containerStyle} className="dash-anim-element delay-8">
      <h3 style={sectionTitleStyle}>INVESTMENT OUTLOOK</h3>
      
      <div style={gridStyle}>
        <div style={infoColStyle}>
          <div style={metricStyle}>
            <div style={metricLabelStyle}>Monthly Investable</div>
            <div style={metricValueStyle}>{outlook.monthlyInvestable}</div>
          </div>
          <div style={metricStyle}>
            <div style={metricLabelStyle}>Risk Profile</div>
            <div style={metricValueStyle}>{outlook.riskProfile}</div>
          </div>
        </div>
        
        <div style={allocationColStyle}>
          {outlook.allocation.map((item, idx) => (
            <div key={idx} style={allocItemStyle}>
              <div style={allocHeaderStyle}>
                <span>{item.name}</span>
                <span>{item.percentage}%</span>
              </div>
              <div style={barContainerStyle}>
                <div style={{...barFillStyle, width: `${item.percentage}%`}} />
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

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '64px',
};

const infoColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
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

const allocationColStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const allocItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const allocHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.875rem',
  color: 'var(--text-primary)',
};

const barContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '1px',
  background: 'rgba(255, 255, 255, 0.1)',
};

const barFillStyle: React.CSSProperties = {
  height: '100%',
  background: 'var(--accent-gold)',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 768px) {
      .invest-grid {
        grid-template-columns: 1fr !important;
        gap: 48px !important;
      }
    }
  `;
  document.head.appendChild(style);
  gridStyle.className = 'invest-grid';
}
