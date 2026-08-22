import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useDelayedUnmount } from '../../../hooks/useDelayedUnmount';
import { X, TrendingUp, AlertTriangle } from 'lucide-react';
import { AVAILABLE_CATEGORIES, Budget } from '../../../data/mockBudgetData';
import { FinWiseDropdown } from './BudgetSharedComponents';

interface CreateBudgetPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  selectedMonth: string;
}

export const CreateBudgetPanel: React.FC<CreateBudgetPanelProps> = ({ isOpen, onClose, onSubmit, selectedMonth }) => {
  const { shouldRender, isClosing } = useDelayedUnmount(isOpen, 400);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [month, setMonth] = useState(selectedMonth);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategory('');
      setLimit('');
      setMonth(selectedMonth);
      setNote('');
      setError('');
    }
  }, [isOpen, selectedMonth]);

  if (!shouldRender) return null;

  const handleSubmit = () => {
    const amount = parseFloat(limit.replace(/[^\d.]/g, ''));
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }
    if (amount > 10000000) {
      setError("Budget amount exceeds reasonable limit.");
      return;
    }
    
    onSubmit({
      category,
      limit: amount,
      month,
      note
    });
    onClose();
  };

  return createPortal(
    <div className={`qa-overlay center opening ${isClosing ? 'closing' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`qa-panel floating opening ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="qa-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="qa-panel-content">
          <div className="qa-form-header">
            <h2>CREATE A BUDGET</h2>
          </div>

          {error && (
            <div style={{ color: '#C46C6C', fontSize: '0.85rem', marginBottom: '24px', padding: '12px', background: 'rgba(196, 108, 108, 0.1)', borderRadius: '6px' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>CATEGORY</label>
            <FinWiseDropdown value={category} options={AVAILABLE_CATEGORIES} onChange={setCategory} placeholder="Select category..." />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>MONTHLY LIMIT</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0', top: '2px', color: 'var(--text-muted)', fontSize: '1.5rem', fontFamily: 'var(--font-primary)' }}>₹</span>
              <input 
                type="text" 
                style={{ 
                  width: '100%', 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-primary)',
                  padding: '4px 0 4px 32px',
                  outline: 'none'
                }}
                placeholder="0.00" 
                value={limit}
                onChange={e => setLimit(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>MONTH</label>
            <FinWiseDropdown 
              value={month} 
              options={['June 2026', 'July 2026', 'August 2026', 'September 2026']} 
              onChange={setMonth} 
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>NOTE (OPTIONAL)</label>
            <textarea 
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                padding: '12px',
                fontSize: '0.9rem',
                outline: 'none',
                minHeight: '80px',
                resize: 'none'
              }}
              placeholder="e.g. Keep dining under control"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button onClick={onClose} style={cancelBtnStyle}>CANCEL</button>
            <button onClick={handleSubmit} style={submitBtnStyle}>CREATE BUDGET</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


interface CategoryDetailPanelProps {
  category: string;
  onClose: () => void;
  budgets: Budget[];
  selectedMonth: string;
  spent: number;
}

export const CategoryDetailPanel: React.FC<CategoryDetailPanelProps> = ({ category, onClose, budgets, selectedMonth, spent }) => {
  const { shouldRender, isClosing } = useDelayedUnmount(!!category, 400);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (category) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [category, onClose]);
  if (!shouldRender) return null;

  const budget = budgets.find(b => b.category === category && b.month === selectedMonth);
  if (!budget) return null;

  const remaining = Math.max(budget.limit - spent, 0);

  return createPortal(
    <div className={`qa-overlay center opening ${isClosing ? 'closing' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`qa-panel floating opening ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="qa-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="qa-panel-content">
          <div className="qa-form-header">
            <h2 style={{ textTransform: 'uppercase' }}>{category}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' }}>
            <div>
              <div className="budget-subtitle">Budget</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>₹{budget.limit.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="budget-subtitle">Spent</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>₹{spent.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="budget-subtitle">Remaining</div>
              <div style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>₹{remaining.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div className="budget-subtitle" style={{ marginBottom: '12px' }}>Monthly trend</div>
            <div style={{ height: '80px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '12px' }}>
               {/* Fake small bar chart for trend */}
               <div style={{ width: '20%', height: '40%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
               <div style={{ width: '20%', height: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
               <div style={{ width: '20%', height: '30%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }} />
               <div style={{ width: '20%', height: '80%', background: 'var(--accent-gold)', borderRadius: '2px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div className="budget-subtitle" style={{ marginBottom: '12px' }}>Top spending sources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Amazon</span>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{(spent * 0.4).toLocaleString('en-IN')}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Local Supermarket</span>
                 <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{(spent * 0.25).toLocaleString('en-IN')}</span>
               </div>
            </div>
          </div>

          <div className="budget-glass-panel" style={{ background: 'rgba(201, 164, 108, 0.05)', borderColor: 'rgba(201, 164, 108, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={16} color="var(--accent-gold)" />
              <span style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em' }}>AI RECOMMENDATION</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              You are spending 15% more on {category} this month compared to your 6-month average. 
              Consider delaying non-essential purchases to stay within your ₹{budget.limit.toLocaleString('en-IN')} limit.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


// Styles
const cancelBtnStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-primary)',
  padding: '16px',
  borderRadius: '8px',
  fontFamily: 'var(--font-secondary)',
  fontWeight: 600,
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};

const submitBtnStyle: React.CSSProperties = {
  flex: 2,
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: 'var(--text-primary)',
  padding: '16px',
  borderRadius: '8px',
  fontFamily: 'var(--font-secondary)',
  fontWeight: 600,
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'var(--transition-smooth)'
};
