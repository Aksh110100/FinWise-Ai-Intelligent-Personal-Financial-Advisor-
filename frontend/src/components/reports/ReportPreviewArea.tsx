import React from 'react';
import { Maximize2, Download } from 'lucide-react';

interface Props {
  onOpenPreview: () => void;
}

export const ReportPreviewArea: React.FC<Props> = ({ onOpenPreview }) => {
  return (
    <div className="report-section-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <h3 className="report-section-title" style={{ marginBottom: '16px' }}>REPORT PREVIEW</h3>
      </div>
      
      <div className="report-preview-area">
        
        <div className="doc-mock">
          <div className="doc-header">
            <div className="doc-title" style={{ display: 'flex', alignItems: 'center' }}>
               <img src="/logo.png" alt="FinWise AI" style={{ height: '56px', objectFit: 'contain', marginLeft: '-8px' }} />
            </div>
            <div className="doc-subtitle" style={{ color: 'var(--accent-gold)' }}>Financial Intelligence Report</div>
            <div className="doc-subtitle" style={{ marginTop: '16px', fontWeight: 600 }}>AUGUST 2026</div>
          </div>
          
          <div style={{ marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
            Financial Overview
          </div>
          
          <div style={{ maxWidth: '400px' }}>
            <div className="doc-row">
              <span className="doc-label">Net Income</span>
              <span className="doc-value">₹85,000</span>
            </div>
            <div className="doc-row">
              <span className="doc-label">Expenses</span>
              <span className="doc-value">₹54,200</span>
            </div>
            <div className="doc-row">
              <span className="doc-label">Savings</span>
              <span className="doc-value">₹30,800</span>
            </div>
            <div className="doc-row" style={{ marginTop: '24px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <span className="doc-label" style={{ color: 'var(--text-primary)' }}>Savings Rate</span>
              <span className="doc-value" style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>36.2%</span>
            </div>
          </div>
        </div>

        <div className="preview-overlay">
          <div className="preview-overlay-actions">
            <button className="btn-primary" onClick={onOpenPreview} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Maximize2 size={16} /> OPEN PREVIEW
            </button>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={16} /> DOWNLOAD REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
