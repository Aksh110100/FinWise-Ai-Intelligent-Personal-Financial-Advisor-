import React, { useState } from 'react';
import { ImportManager } from './ImportManager';
import { useDashboard } from '../../context/DashboardContext';

export const QuickActions: React.FC = () => {
  const [activeImport, setActiveImport] = useState<'csv' | 'receipt' | null>(null);
  const { transactions } = useDashboard();

  const handleExport = () => {
    if (!transactions || transactions.length === 0) return;
    
    const headers = ['date', 'merchant', 'category', 'amount', 'type', 'paymentMethod', 'source'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(tx => {
      const row = [
        tx.date,
        `"${tx.merchant.replace(/"/g, '""')}"`,
        tx.category,
        tx.amount,
        tx.type,
        tx.paymentMethod,
        tx.source || 'manual'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `finwise_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section style={containerStyle} className="dash-anim-element delay-10">
        <div style={actionsContainerStyle}>
          <ActionBtn label="+ ADD EXPENSE" />
          <ActionBtn label="+ ADD INCOME" />
          <ActionBtn label="◎ CREATE GOAL" />
          <ActionBtn label="↗ PLAN INVESTMENT" />
          <ActionBtn label="IMPORT DATA" onClick={() => setActiveImport('csv')} />
          <ActionBtn label="SCAN RECEIPT" onClick={() => setActiveImport('receipt')} />
          <ActionBtn label="EXPORT DATA" onClick={handleExport} />
        </div>
      </section>

      <ImportManager 
        isOpen={activeImport !== null}
        initialFlow={activeImport} 
        onClose={() => setActiveImport(null)} 
      />
    </>
  );
};

const ActionBtn: React.FC<{label: string, onClick?: () => void, highlight?: boolean}> = ({ label, onClick, highlight }) => (
  <button 
    onClick={onClick}
    style={{
      ...btnStyle, 
      color: highlight ? 'var(--accent-gold)' : 'var(--text-secondary)',
      borderColor: highlight ? 'rgba(201, 164, 108, 0.3)' : 'rgba(255, 255, 255, 0.1)',
    }} className="quick-action-btn">
    <span>{label}</span>
  </button>
);

// Styles
const containerStyle: React.CSSProperties = {
  marginBottom: '4rem',
  padding: '0 2rem',
  display: 'flex',
  justifyContent: 'center',
};

const actionsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  justifyContent: 'center',
};

const btnStyle: React.CSSProperties = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 24px',
  borderRadius: '32px',
  border: '1px solid',
  fontFamily: 'var(--font-primary)',
  fontSize: '0.85rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  cursor: 'pointer',
  transition: 'all 0.2s',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .quick-action-btn:hover {
      background: rgba(255, 255, 255, 0.1) !important;
      color: var(--text-primary) !important;
      border-color: rgba(255, 255, 255, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
}
