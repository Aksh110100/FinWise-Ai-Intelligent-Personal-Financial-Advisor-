import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Transaction } from '../../../data/mockTransactions';

interface TransactionDetailPanelProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetailPanel: React.FC<TransactionDetailPanelProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  return createPortal(
    <div className="qa-overlay center opening" onClick={onClose}>
      {/* Panel */}
      <div className="qa-panel floating opening" onClick={(e) => e.stopPropagation()}>
        <button className="qa-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="qa-panel-content">
          <div className="qa-form-header">
            <h2>TRANSACTION DETAILS</h2>
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>MERCHANT</div>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{transaction.merchant}</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>AMOUNT</div>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '2rem', color: transaction.type === 'expense' ? 'var(--text-primary)' : 'var(--text-positive)' }}>
              {transaction.type === 'expense' ? '−' : '+'} ₹{transaction.amount.toLocaleString('en-IN')}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>CATEGORY</div>
            <div style={{ color: 'var(--text-primary)' }}>{transaction.category}</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>DATE</div>
            <div style={{ color: 'var(--text-primary)' }}>
              {new Date(transaction.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>PAYMENT METHOD</div>
            <div style={{ color: 'var(--text-primary)' }}>{transaction.paymentMethod}</div>
          </div>

          {transaction.note && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>NOTE</div>
              <div style={{ color: 'var(--text-primary)' }}>{transaction.note}</div>
            </div>
          )}
          
        </div>
      </div>
    </div>,
    document.body
  );
};
