import React, { useState } from 'react';
import { ImportManager } from './ImportManager';

type ImportType = 'csv' | 'statement' | 'receipt' | null;

export const FinancialImportCenter: React.FC = () => {
  const [activeImport, setActiveImport] = useState<ImportType>(null);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>BRING YOUR FINANCES TO FINWISE</h3>
      
      <div style={gridStyle}>
        <ImportOption 
          title="IMPORT DATA" 
          format="CSV / XLSX" 
          desc="Bring your transaction history." 
          onClick={() => setActiveImport('csv')} 
        />
        <ImportOption 
          title="SCAN STATEMENT" 
          format="IMAGE / PDF" 
          desc="Extract transactions automatically." 
          onClick={() => setActiveImport('statement')} 
        />
        <ImportOption 
          title="SCAN RECEIPT" 
          format="IMAGE" 
          desc="Turn receipts into expenses." 
          onClick={() => setActiveImport('receipt')} 
        />
      </div>

      {activeImport && (
        <ImportManager 
          initialFlow={activeImport} 
          onClose={() => setActiveImport(null)} 
        />
      )}
    </div>
  );
};

const ImportOption: React.FC<{title: string, format: string, desc: string, onClick: () => void}> = ({ title, format, desc, onClick }) => (
  <button style={optionBtnStyle} onClick={onClick} className="chip">
    <div style={optionHeaderStyle}>
      <span style={optionTitleStyle}>{title}</span>
      <span style={optionFormatStyle}>{format}</span>
    </div>
    <p style={optionDescStyle}>{desc}</p>
  </button>
);

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

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '1.5rem',
};

const optionBtnStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '12px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  cursor: 'pointer',
  textAlign: 'left',
};

const optionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  width: '100%'
};

const optionTitleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.1rem',
  color: 'var(--accent-gold)',
};

const optionFormatStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em'
};

const optionDescStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  margin: 0
};

