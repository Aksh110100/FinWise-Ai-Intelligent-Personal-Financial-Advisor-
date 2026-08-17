import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const AISavingOpportunities: React.FC = () => {
  const { dashboardData } = useDashboard();
  const { savingOpportunities, savingOpportunitiesTotal } = dashboardData;

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>WHERE YOU CAN SAVE</h3>
      
      <div style={cardStyle}>
        <div style={listStyle}>
          {savingOpportunities.map((opp, idx) => (
            <div key={idx} style={itemStyle}>
              <span style={categoryStyle}>{opp.category}</span>
              <span style={amountStyle}>{opp.amount}</span>
            </div>
          ))}
        </div>
        
        <div style={footerStyle}>
          <div style={totalGroupStyle}>
            <span style={totalLabelStyle}>POTENTIAL MONTHLY SAVING</span>
            <span style={totalAmountStyle}>{savingOpportunitiesTotal}</span>
          </div>
          <button style={viewAllBtnStyle} className="float-tag">VIEW ALL &rarr;</button>
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
  border: '1px solid var(--accent-gold)',
  borderRadius: '16px',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  position: 'relative',
  overflow: 'hidden'
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem'
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid rgba(255,255,255,0.05)'
};

const categoryStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '1rem',
  color: 'var(--text-primary)'
};

const amountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.1rem',
  color: 'var(--text-secondary)'
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  background: 'rgba(201, 164, 108, 0.05)',
  margin: '-2rem',
  marginTop: 0,
  padding: '2rem',
  borderTop: '1px solid rgba(201, 164, 108, 0.15)'
};

const totalGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const totalLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--accent-gold)',
  letterSpacing: '0.05em'
};

const totalAmountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '2rem',
  color: 'var(--text-primary)'
};

const viewAllBtnStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--accent-gold)',
  color: 'var(--accent-gold)',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.8rem',
  letterSpacing: '0.05em',
  cursor: 'pointer'
};
