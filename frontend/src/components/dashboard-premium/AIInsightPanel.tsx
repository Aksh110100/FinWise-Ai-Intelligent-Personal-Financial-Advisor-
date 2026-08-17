import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

interface AIInsightPanelProps {
  isOpen: boolean;
  insightType: string | null;
  onClose: () => void;
  onApply: (type: string) => void;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ isOpen, insightType, onClose, onApply }) => {
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 350);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`qa-overlay ${isClosing ? 'closing' : 'opening'}`} onClick={handleBackdropClick}>
      <div className={`qa-panel ${isClosing ? 'closing' : 'opening'}`}>
        <div className="qa-panel-header">
          <div className="qa-panel-title">
            <span className="qa-icon-wrapper">
              <Check size={20} color="var(--accent-gold)" />
            </span>
            <h3>OPTIMIZE YOUR SPENDING</h3>
          </div>
          <button className="qa-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="qa-panel-content">
          <div className="qa-form-group stagger-1">
            <label>CATEGORY</label>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)' }}>DINING</div>
          </div>

          <div className="qa-form-row stagger-2" style={{ marginTop: '24px' }}>
            <div className="qa-form-group">
              <label>CURRENT</label>
              <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>₹12,400</div>
            </div>
            <div className="qa-form-group">
              <label>RECOMMENDED</label>
              <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>₹10,000</div>
            </div>
          </div>

          <div className="qa-form-group stagger-3" style={{ marginTop: '24px' }}>
            <label>POTENTIAL SAVING</label>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-positive)' }}>₹2,400</div>
          </div>

          <div className="qa-form-group stagger-4" style={{ marginTop: '32px' }}>
            <label>YOUR RECENT DINING SPENDING</label>
            <div style={{ 
              display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px',
              background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <span>The Vintage Cafe</span>
                <span>₹1,200</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <span>Zomato Delivery</span>
                <span>₹850</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <span>Starbucks</span>
                <span>₹650</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <span>+ 14 other transactions</span>
              </div>
            </div>
          </div>

          <div className="qa-form-group stagger-5" style={{ marginTop: '32px' }}>
            <label style={{ color: 'var(--accent-gold)' }}>AI SUGGESTION</label>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginTop: '8px' }}>
              Reducing dining by approximately 20% would keep your current lifestyle while improving your monthly savings rate.
            </p>
          </div>

          <div className="qa-form-actions stagger-6" style={{ marginTop: '40px' }}>
            <button className="btn-secondary" onClick={onClose}>
              CLOSE
            </button>
            <button className="btn-primary" onClick={() => onApply(insightType)}>
              APPLY SUGGESTION <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
