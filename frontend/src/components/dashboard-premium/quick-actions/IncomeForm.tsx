import React, { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface IncomeFormProps {
  onCancel: () => void;
  onSuccess: (data: any, amountFormatted: string, source: string) => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ onCancel, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (!source) {
      setError('Please select an income source.');
      return;
    }

    const data = { amount: parseFloat(amount), source, date, description };
    const formattedAmount = '₹ ' + parseFloat(amount).toLocaleString('en-IN');
    
    onSuccess(data, formattedAmount, source);
  };

  return (
    <form className="qa-form" onSubmit={handleSubmit}>
      <div className="qa-form-header stagger-0">
        <div className="qa-ambient-glow"></div>
        <h2>ADD INCOME</h2>
      </div>

      <div className="qa-form-group stagger-1">
        <label>AMOUNT</label>
        <div className="qa-amount-input text-emerald">
          <span>₹</span>
          <input 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setError(''); }}
            step="0.01"
            autoFocus
          />
        </div>
      </div>

      <div className="qa-form-group stagger-2">
        <label>SOURCE</label>
        <CustomSelect 
          value={source}
          onChange={(val) => { setSource(val); setError(''); }}
          placeholder="Select source..."
          options={[
            { value: 'Salary', label: 'Salary' },
            { value: 'Freelance', label: 'Freelance' },
            { value: 'Business', label: 'Business' },
            { value: 'Investment', label: 'Investment' },
            { value: 'Other', label: 'Other' },
          ]}
        />
      </div>

      <div className="qa-form-group stagger-3">
        <label>DATE</label>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="qa-form-group stagger-4">
        <label>DESCRIPTION (OPTIONAL)</label>
        <input 
          type="text" 
          placeholder="e.g. Q3 Bonus"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {error && <div className="qa-error-msg stagger-5">{error}</div>}

      <div className="qa-form-actions stagger-5">
        <button type="button" className="qa-btn-cancel" onClick={onCancel}>CANCEL</button>
        <button type="submit" className="qa-btn-primary">ADD INCOME →</button>
      </div>
    </form>
  );
};
