import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';
import { ExpenseForm } from './quick-actions/ExpenseForm';
import { IncomeForm } from './quick-actions/IncomeForm';
import { GoalForm } from './quick-actions/GoalForm';
import { InvestmentForm } from './quick-actions/InvestmentForm';

export type ActionType = 'expense' | 'income' | 'goal' | 'investment' | null;

interface QuickActionPanelProps {
  isOpen: boolean;
  activeAction: ActionType;
  onClose: () => void;
  onSuccess: (data: any, actionType: ActionType) => void;
}

export const QuickActionPanel: React.FC<QuickActionPanelProps> = ({ isOpen, activeAction, onClose, onSuccess }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [successState, setSuccessState] = useState<{show: boolean, message: string, amount: string, sub: string}>({show: false, message: '', amount: '', sub: ''});

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setSuccessState({show: false, message: '', amount: '', sub: ''});
      
      const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 400); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSuccess = (data: any, msg: string, amt: string, sub: string) => {
    setSuccessState({ show: true, message: msg, amount: amt, sub });
    
    // Notify parent immediately
    onSuccess(data, activeAction);

    // Close after short delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return createPortal(
    <div className={`qa-overlay center ${isClosing ? 'closing' : 'opening'}`} onClick={handleBackdropClick}>
      <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`}>
        <button className="qa-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="qa-panel-content">
          {successState.show ? (
            <div className="qa-success-state">
              <div className="success-icon"><Check size={32} /></div>
              <h3>{successState.message}</h3>
              <div className="success-amount">{successState.amount}</div>
              <div className="success-sub">{successState.sub}</div>
              <p>Added to your financial overview.</p>
              <button className="qa-btn-primary" onClick={onClose}>DONE →</button>
            </div>
          ) : (
            <>
              {activeAction === 'expense' && <ExpenseForm onCancel={onClose} onSuccess={(d, amt, cat) => handleSuccess(d, 'EXPENSE ADDED', amt, cat)} />}
              {activeAction === 'income' && <IncomeForm onCancel={onClose} onSuccess={(d, amt, src) => handleSuccess(d, 'INCOME ADDED', amt, src)} />}
              {activeAction === 'goal' && <GoalForm onCancel={onClose} onSuccess={(d, name) => handleSuccess(d, 'GOAL CREATED', name, 'Target set')} />}
              {activeAction === 'investment' && <InvestmentForm onCancel={onClose} onSuccess={(d, amt) => handleSuccess(d, 'INVESTMENT PLANNED', amt, 'Monthly Contribution')} />}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
