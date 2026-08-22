import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X } from 'lucide-react';

const categories = [
  { name: 'Housing', amount: 14000, percent: 26 },
  { name: 'Food & Dining', amount: 12400, percent: 23 },
  { name: 'Shopping', amount: 7500, percent: 14 },
  { name: 'Transport', amount: 6800, percent: 12 },
  { name: 'Utilities', amount: 5300, percent: 10 },
  { name: 'Subscriptions', amount: 4200, percent: 8 },
  { name: 'Other', amount: 4000, percent: 7 }
];

const ViewExpensesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={`report-modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="report-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        <div className="modal-header">
          <div>
            <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-primary)' }}>Dining Expenses</h4>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>August 2026 vs July 2026</div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '24px' }}>
           <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Here are the recent transactions that contributed to the 18% increase in dining expenses.</p>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'The Golden Fork', date: 'Aug 14, 2026', amount: '₹3,400' },
                { name: 'Bistro 42', date: 'Aug 10, 2026', amount: '₹2,100' },
                { name: 'Cafe Mocha', date: 'Aug 05, 2026', amount: '₹850' },
                { name: 'Uber Eats', date: 'Aug 02, 2026', amount: '₹1,200' },
              ].map(tx => (
                 <div key={tx.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                       <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{tx.name}</div>
                       <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>{tx.date}</div>
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}>{tx.amount}</div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export const ExpenseDistribution: React.FC = () => {
  const [animate, setAnimate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ViewExpensesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div className="report-two-col">
      <div className="report-section-card">
        <h3 className="report-section-title">WHERE YOUR MONEY WENT</h3>
        
        <div className="expense-cat-list">
          {categories.map((cat, i) => (
            <div key={cat.name} className="expense-cat-item">
              <div className="expense-cat-header">
                <span>{cat.name}</span>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className="expense-cat-value">₹{cat.amount.toLocaleString('en-IN')}</span>
                  <span style={{ color: 'var(--text-primary)', width: '30px', textAlign: 'right' }}>{cat.percent}%</span>
                </div>
              </div>
              <div className="expense-cat-bar-bg">
                <div 
                  className="expense-cat-bar-fill" 
                  style={{ 
                    width: animate ? `${cat.percent}%` : '0%',
                    transitionDelay: `${i * 100}ms`
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--grad-glow)', borderRadius: '50%', opacity: 0.5, pointerEvents: 'none' }}></div>
        
        <h3 className="report-section-title">SPENDING SIGNAL</h3>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
            FINWISE AI NOTICED
          </div>
          
          <p style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '24px' }}>
            "Dining expenses increased 18% compared with last month."
          </p>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>POTENTIAL IMPACT</div>
            <div style={{ fontSize: '1.5rem', color: '#f43f5e', fontFamily: 'var(--font-primary)' }}>-₹2,400 / MONTH</div>
          </div>
          
          <button style={{ 
            background: 'transparent',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'var(--transition-smooth)'
          }}
          className="btn-hover-glow"
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(201, 164, 108, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          >
            VIEW EXPENSES <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
