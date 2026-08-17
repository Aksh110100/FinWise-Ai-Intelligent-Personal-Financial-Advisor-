import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BudgetAIAdvisorProps {
  onOptimize?: () => void;
}

export const BudgetAIAdvisor: React.FC<BudgetAIAdvisorProps> = ({ onOptimize }) => {
  return (
    <div className="budget-glass-panel" style={{ border: '1px solid rgba(201, 164, 108, 0.2)', background: 'rgba(201, 164, 108, 0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Sparkles size={16} color="var(--accent-gold)" />
        <span style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em' }}>FINWISE AI</span>
      </div>
      
      <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '0.05em' }}>
        BUDGET SIGNAL
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
        "You're on track overall, but your shopping budget is running 20% above your usual pace."
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>PROJECTED MONTH-END</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>₹7,200</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>BUDGET</div>
          <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>₹6,000</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>POTENTIAL OVERSPEND</div>
          <div style={{ fontSize: '1.25rem', color: '#C46C6C', fontWeight: 600 }}>₹1,200</div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.1em' }}>
          AI SUGGESTION
        </div>
        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          "Reducing shopping by approximately ₹300 per week would keep you within your monthly target."
        </p>
      </div>

      <button className="ai-action-btn" onClick={onOptimize}>
        OPTIMIZE BUDGET <ArrowRight size={16} />
      </button>
    </div>
  );
};

export const RoomToSave: React.FC = () => {
  return (
    <div className="budget-glass-panel">
      <h4 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        ROOM TO SAVE
      </h4>
      <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-primary)', color: 'var(--text-positive)', fontWeight: 600, marginBottom: '4px' }}>
        ₹4,800
      </div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Potential monthly savings
      </div>
      
      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
        Based on: <br/>
        <span style={{ color: 'var(--text-primary)' }}>Food, Shopping, Subscriptions</span>
      </div>

      <button style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--accent-gold)',
        fontSize: '0.85rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        padding: 0
      }}>
        VIEW OPPORTUNITIES <ArrowRight size={14} />
      </button>
    </div>
  );
};
