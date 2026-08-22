import React, { useState, useRef, useEffect } from 'react';
import { useDelayedUnmount } from '../../hooks/useDelayedUnmount';
import { createPortal } from 'react-dom';
import { useDashboard } from '../../context/DashboardContext';
import { parseCSV, parseExcel } from '../../utils/fileParsers';
import { processStatement, processReceipt } from '../../utils/ocrSimulation';
import { categorizeTransaction } from '../../utils/transactionCategorizer';
import { Transaction } from '../../data/mockTransactions';
import { X, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

type ImportFlow = 'csv' | 'statement' | 'receipt' | null;
type Step = 'upload' | 'mapping' | 'processing' | 'review' | 'success';

interface ImportManagerProps {
  isOpen: boolean;
  initialFlow: ImportFlow;
  onClose: () => void;
}

export const ImportManager: React.FC<ImportManagerProps> = ({ isOpen, initialFlow, onClose }) => {
  const { addTransactions, addTransaction } = useDashboard();
  
  const [flow, setFlow] = useState<ImportFlow>(initialFlow || 'csv');
  const [step, setStep] = useState<Step>('upload');
  
  const [file, setFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<{ [key: string]: string }>({
    date: '', merchant: '', amount: '', category: '', paymentMethod: ''
  });
  
  const [transactionsToImport, setTransactionsToImport] = useState<Omit<Transaction, 'id'>[]>([]);
  const [ocrMsg, setOcrMsg] = useState('');
  const [importResult, setImportResult] = useState({ imported: 0, duplicates: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (f: File) => {
    setErrorMsg('');
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("FILE TOO LARGE. Please upload a file smaller than 10 MB.");
      return;
    }
    
    setFile(f);
    
    try {
      if (flow === 'csv') {
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (!['csv', 'xlsx', 'xls'].includes(ext || '')) {
          setErrorMsg("UNSUPPORTED FILE. Please upload CSV, XLS or XLSX.");
          return;
        }
        
        setStep('processing');
        let result;
        if (ext === 'csv') {
          result = await parseCSV(f);
        } else {
          result = await parseExcel(f);
        }
        
        if (result && result.meta && result.data) {
          setHeaders(result.meta.fields);
          setRawData(result.data);
          autoMapColumns(result.meta.fields);
          setStep('mapping');
        } else {
          setErrorMsg("Could not parse file. Empty or corrupt.");
          setStep('upload');
        }
      } 
      else if (flow === 'statement') {
        setStep('processing');
        setOcrMsg("READING STATEMENT...");
        setTimeout(() => setOcrMsg("ANALYZING CONTENT..."), 1000);
        setTimeout(() => setOcrMsg("DETECTING TRANSACTIONS..."), 2000);
        setTimeout(() => setOcrMsg("PREPARING IMPORT..."), 3000);
        
        const txs = await processStatement(f);
        setTransactionsToImport(txs);
        setStep('review');
      }
      else if (flow === 'receipt') {
        setStep('processing');
        setOcrMsg("PROCESSING RECEIPT...");
        const tx = await processReceipt(f);
        setTransactionsToImport([{
          merchant: tx.merchant,
          amount: tx.amount,
          category: tx.category,
          date: tx.date,
          paymentMethod: 'Cash',
          type: 'expense',
          source: 'receipt',
          note: tx.items.map((i: any) => i.name).join(', ')
        }]);
        setStep('review');
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while parsing the file.");
      setStep('upload');
    }
  };

  const autoMapColumns = (fields: string[]) => {
    const map = { ...mappings };
    const lowerFields = fields.map(f => f.toLowerCase());
    
    const findField = (keywords: string[]) => {
      const idx = lowerFields.findIndex(f => keywords.some(k => f.includes(k)));
      return idx >= 0 ? fields[idx] : '';
    };

    map.date = findField(['date', 'time']);
    map.merchant = findField(['desc', 'merchant', 'name', 'particulars']);
    map.amount = findField(['amount', 'debit', 'withdrawal', 'credit', 'deposit']);
    map.category = findField(['category', 'type']);
    map.paymentMethod = findField(['payment', 'mode', 'channel']);
    
    setMappings(map);
  };

  const finalizeMapping = () => {
    if (!mappings.date || !mappings.amount || !mappings.merchant) {
      setErrorMsg("Date, Merchant, and Amount columns are required.");
      return;
    }

    const txs: Omit<Transaction, 'id'>[] = rawData.map(row => {
      let rawAmount = row[mappings.amount] || '';
      let numAmount = 0;
      let type: 'income' | 'expense' = 'expense';
      
      if (typeof rawAmount === 'string') {
        const clean = rawAmount.replace(/[^\d.-]/g, '');
        numAmount = parseFloat(clean) || 0;
        if (numAmount < 0 || rawAmount.toLowerCase().includes('dr') || rawAmount.toLowerCase().includes('debit')) {
           type = 'expense';
           numAmount = Math.abs(numAmount);
        } else if (numAmount > 0) {
           type = 'income'; 
        }
      } else {
        numAmount = parseFloat(rawAmount) || 0;
        type = numAmount < 0 ? 'expense' : 'income';
        numAmount = Math.abs(numAmount);
      }

      const rawDate = row[mappings.date] || new Date().toISOString();
      const merchant = row[mappings.merchant] || 'Unknown';
      let category = row[mappings.category];
      
      if (!category) {
        category = categorizeTransaction(merchant, '');
      }

      return {
        date: new Date(rawDate).toISOString(),
        merchant,
        amount: numAmount,
        type,
        category,
        paymentMethod: row[mappings.paymentMethod] || 'Bank Transfer',
        source: 'csv'
      };
    }).filter(tx => tx.amount > 0);

    setTransactionsToImport(txs);
    setStep('review');
  };

  const handleImport = () => {
    if (transactionsToImport.length > 0) {
      if (flow === 'receipt') {
        addTransaction(transactionsToImport[0]);
        setImportResult({ imported: 1, duplicates: 0 });
      } else {
        const res = addTransactions(transactionsToImport);
        setImportResult(res);
      }
      setStep('success');
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { shouldRender, isClosing } = useDelayedUnmount(isOpen, 400);

  if (!shouldRender) return null;

  const modalContent = (
    <div className={`qa-overlay center opening ${isClosing ? 'closing' : ''}`} onClick={handleBackdropClick} style={{zIndex: 9999}}>
      <div className={`qa-panel floating opening ${isClosing ? 'closing' : ''}`} style={{ maxWidth: '600px', width: '90%' }}>
        <button className="qa-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="qa-panel-content">
          {step !== 'success' && (
            <div className="qa-form-header stagger-0">
              <div className="qa-ambient-glow"></div>
              <h2>{flow === 'csv' ? 'IMPORT DATA' : flow === 'statement' ? 'SCAN STATEMENT' : 'SCAN RECEIPT'}</h2>
            </div>
          )}

          {step === 'upload' && (
            <div style={uploadContainerStyle} 
                 className="stagger-1"
                 onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
                 onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                 onDrop={handleDrop}>
              
              <UploadCloud size={48} color="var(--accent-gold)" style={{marginBottom: '1rem'}} />
              <p style={{fontFamily: 'var(--font-primary)', fontSize: '1rem', letterSpacing: '0.1em', margin: '0 0 1rem 0'}}>
                DROP YOUR {flow === 'csv' ? 'CSV/EXCEL' : flow === 'statement' ? 'STATEMENT' : 'RECEIPT'} HERE
              </p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{display: 'none'}} 
                accept={flow === 'csv' ? '.csv,.xlsx,.xls' : 'image/png,image/jpeg,image/jpg,application/pdf'}
                onChange={handleFileChange} 
              />
              <button className="qa-btn-primary" onClick={() => fileInputRef.current?.click()}>
                SELECT FILE
              </button>
              
              {errorMsg && (
                <div style={errorStyle}>
                  <AlertTriangle size={16} /> {errorMsg}
                </div>
              )}
            </div>
          )}

          {step === 'processing' && (
            <div style={processingStyle}>
              <div className="spinner" style={spinnerStyle} />
              <p style={processingMsgStyle}>{ocrMsg || 'PROCESSING FILE...'}</p>
              {file && <p style={fileNameStyle}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
              {flow !== 'csv' && <p style={{color:'var(--accent-gold)', fontSize:'0.8rem', marginTop:'1rem', letterSpacing:'0.1em'}}>DEMO ANALYSIS</p>}
            </div>
          )}

          {step === 'mapping' && flow === 'csv' && (
            <div style={mappingContainerStyle}>
              <div style={mappingGridStyle}>
                {Object.keys(mappings).map(key => (
                  <div key={key} className="qa-form-group" style={{ marginBottom: '1rem' }}>
                    <label>{key.toUpperCase()}</label>
                    <select 
                      className="qa-input"
                      value={mappings[key]}
                      onChange={(e) => setMappings({...mappings, [key]: e.target.value})}
                    >
                      <option value="">-- Select Column --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              
              <button className="qa-btn-primary" onClick={finalizeMapping}>PREVIEW IMPORT</button>
            </div>
          )}

          {step === 'review' && (
            <div style={reviewContainerStyle}>
              <div style={txListStyle}>
                {transactionsToImport.slice(0, 10).map((tx, i) => (
                  <div key={i} style={txRowStyle}>
                    <span style={txDateStyle}>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short'})}</span>
                    <span style={txMerchantStyle}>{tx.merchant}</span>
                    <span style={txCategoryStyle}>{tx.category}</span>
                    <span style={{...txAmountStyle, color: tx.type === 'income' ? 'var(--accent-emerald)' : 'var(--text-primary)'}}>
                      {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                {transactionsToImport.length > 10 && (
                  <div style={{textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem'}}>
                    ...and {transactionsToImport.length - 10} more
                  </div>
                )}
              </div>
              
              <div style={summaryStyle}>
                <p style={{fontFamily: 'var(--font-primary)', fontSize: '1.2rem'}}>{transactionsToImport.length} TRANSACTIONS READY</p>
              </div>

              <div style={btnGroupStyle}>
                <button className="qa-btn" onClick={() => setStep('upload')}>CANCEL</button>
                <button className="qa-btn-primary" onClick={handleImport}>
                  {flow === 'receipt' ? 'ADD EXPENSE' : 'IMPORT DATA'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="qa-success-state">
              <div className="success-icon"><CheckCircle size={32} /></div>
              <h3>{flow === 'receipt' ? 'TRANSACTION ADDED' : 'IMPORT SUCCESSFUL'}</h3>
              <div className="success-amount">
                {flow !== 'receipt' ? `${importResult.imported} TRANSACTIONS` : ''}
              </div>
              {importResult.duplicates > 0 && (
                <div className="success-sub" style={{color: 'var(--accent-gold)'}}>
                  ⚠ {importResult.duplicates} duplicates skipped
                </div>
              )}
              <p>Added to your financial overview.</p>
              <button className="qa-btn-primary" onClick={onClose}>DONE →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Internal Styles
const uploadContainerStyle: React.CSSProperties = {
  border: '2px dashed rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '4rem 2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'all 0.3s',
  background: 'rgba(255,255,255,0.02)',
};

const errorStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  color: '#ff6b6b',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const processingStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4rem 0',
  textAlign: 'center'
};

const spinnerStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '3px solid rgba(255,255,255,0.1)',
  borderTopColor: 'var(--accent-gold)',
  borderRadius: '50%',
  marginBottom: '2rem'
};

const processingMsgStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  color: 'var(--text-primary)',
  letterSpacing: '0.1em',
  fontSize: '1.2rem',
  margin: 0
};

const fileNameStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  marginTop: '1rem'
};

const mappingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const mappingGridStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  background: 'rgba(255,255,255,0.02)',
  padding: '1.5rem',
  borderRadius: '12px',
  border: '1px solid var(--glass-border)'
};

const reviewContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  maxHeight: '60vh'
};

const txListStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem'
};

const txRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '60px 1fr 80px 80px',
  gap: '0.5rem',
  padding: '0.75rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  alignItems: 'center'
};

const txDateStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};

const txMerchantStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const txCategoryStyle: React.CSSProperties = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.75rem',
  color: 'var(--accent-gold)',
  background: 'rgba(201, 164, 108, 0.1)',
  padding: '0.2rem 0.4rem',
  borderRadius: '4px',
  textAlign: 'center'
};

const txAmountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.9rem',
  textAlign: 'right'
};

const summaryStyle: React.CSSProperties = {
  padding: '1rem',
  background: 'rgba(201, 164, 108, 0.05)',
  border: '1px solid rgba(201, 164, 108, 0.2)',
  borderRadius: '8px',
  textAlign: 'center'
};

const btnGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'flex-end',
  marginTop: '1rem'
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .spinner {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
