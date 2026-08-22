import React, { useState, useRef, useEffect } from 'react';
import { useDelayedUnmount } from '../../../hooks/useDelayedUnmount';
import { ChevronDown, Check, X, AlertTriangle } from 'lucide-react';

export const useEscapeKey = (callback: () => void, isActive: boolean) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') callback(); };
    if (isActive) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isActive, callback]);
};

export const FinWiseDropdown: React.FC<{
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
}> = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="budget-dropdown-container" ref={containerRef}>
      <div 
        className="budget-dropdown-selected"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}>
          {value || placeholder || "Select"}
        </span>
        <ChevronDown size={16} color="var(--text-secondary)" />
      </div>
      {isOpen && (
        <div className="budget-dropdown-menu">
          {options.map(opt => (
            <div 
              key={opt}
              className={`budget-dropdown-item ${value === opt ? 'active' : ''}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  categoryName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, categoryName, onConfirm, onCancel }) => {
  const { shouldRender, isClosing } = useDelayedUnmount(isOpen, 300);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!shouldRender) return null;
  return (
    <div style={modalOverlayStyle} className={isClosing ? 'closing' : ''}>
      <div style={modalContentStyle} className="budget-anim-enter">
        <h3 style={{ fontFamily: 'var(--font-primary)', marginBottom: '8px', fontSize: '1.25rem' }}>
          DELETE {categoryName.toUpperCase()} BUDGET?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
          This will remove the budget limit but will not delete your expense transactions.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button style={btnCancelStyle} onClick={onCancel}>CANCEL</button>
          <button style={btnDeleteStyle} onClick={onConfirm}>DELETE BUDGET</button>
        </div>
      </div>
    </div>
  );
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(5,5,5,0.8)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.035)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(18px)',
  padding: '32px',
  borderRadius: '16px',
  maxWidth: '400px',
  width: '90%',
};

const btnCancelStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-secondary)',
  padding: '10px 16px',
  cursor: 'pointer',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  fontWeight: 600,
  letterSpacing: '0.05em'
};

const btnDeleteStyle: React.CSSProperties = {
  background: 'rgba(196, 108, 108, 0.1)',
  border: '1px solid rgba(196, 108, 108, 0.3)',
  color: '#C46C6C',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '8px',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  transition: 'all 0.2s',
};

export const EmptyBudgetState: React.FC<{ onCreateClick: () => void }> = ({ onCreateClick }) => (
  <div style={{ 
    padding: '60px 20px', 
    textAlign: 'center',
    background: 'rgba(255,255,255,0.015)',
    border: '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '16px'
  }}>
    <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '12px' }}>NO BUDGETS YET</h3>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
      Create your first spending limit and let FinWise help you stay on track.
    </p>
    <button 
      onClick={onCreateClick}
      style={{
        background: 'var(--accent-gold)',
        color: 'var(--bg-primary)',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontFamily: 'var(--font-secondary)',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: 'pointer'
      }}
    >
      CREATE BUDGET →
    </button>
  </div>
);

export const RecentBudgetActivity: React.FC = () => (
  <div className="budget-glass-panel">
    <h4 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '16px' }}>
      RECENT BUDGET ACTIVITY
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ActivityItem text="Food budget created" time="Today" />
      <ActivityItem text="Shopping budget exceeded" time="Yesterday" />
      <ActivityItem text="Transport budget updated" time="Aug 12" />
      <ActivityItem text="Food budget reduced" time="Aug 10" />
    </div>
  </div>
);

const ActivityItem: React.FC<{ text: string, time: string }> = ({ text, time }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{text}</span>
    </div>
    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{time}</span>
  </div>
);
