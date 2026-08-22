import React, { useState } from 'react';
import { Plus, Target, TrendingUp, Download, FileText, UploadCloud } from 'lucide-react';
import { ImportManager } from '../dashboard/ImportManager';
import { useDashboard } from '../../context/DashboardContext';

interface QuickActionsProps {
  onActionClick?: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
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
      <div className="quick-actions-row anim-fade-up delay-2">
        <button className="qa-btn" onClick={() => onActionClick?.('expense')}>
          <Plus size={16} />
          <span>ADD EXPENSE</span>
        </button>
        <button className="qa-btn" onClick={() => onActionClick?.('income')}>
          <Plus size={16} />
          <span>ADD INCOME</span>
        </button>
        <button className="qa-btn" onClick={() => onActionClick?.('goal')}>
          <Target size={16} />
          <span>CREATE GOAL</span>
        </button>
        <button className="qa-btn" onClick={() => onActionClick?.('investment')}>
          <TrendingUp size={16} />
          <span>PLAN INVESTMENT</span>
        </button>
        <button className="qa-btn" onClick={() => setActiveImport('csv')}>
          <Download size={16} />
          <span>IMPORT DATA</span>
        </button>
        <button className="qa-btn" onClick={() => setActiveImport('receipt')}>
          <FileText size={16} />
          <span>SCAN RECEIPT</span>
        </button>
        <button className="qa-btn" onClick={handleExport}>
          <UploadCloud size={16} />
          <span>EXPORT DATA</span>
        </button>
      </div>
      
      <ImportManager 
        isOpen={activeImport !== null}
        initialFlow={activeImport} 
        onClose={() => setActiveImport(null)} 
      />
    </>
  );
};
