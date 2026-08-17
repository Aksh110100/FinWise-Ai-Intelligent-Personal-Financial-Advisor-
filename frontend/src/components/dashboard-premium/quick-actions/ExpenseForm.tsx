import React, { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface ExpenseFormProps {
  onCancel: () => void;
  onSuccess: (data: any, amountFormatted: string, category: string) => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onCancel, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0.');
      return;
    }
    if (!category) {
      setError('Please select a category.');
      return;
    }

    const data = { amount: parseFloat(amount), category, date, method, note };
    // Format to INR style string manually or via Intl
    const formattedAmount = '₹ ' + parseFloat(amount).toLocaleString('en-IN');
    
    onSuccess(data, formattedAmount, category);
  };

  return (
    <form className="qa-form" onSubmit={handleSubmit}>
      <div className="qa-form-header stagger-0">
        <div className="qa-ambient-glow"></div>
        <h2>ADD AN EXPENSE</h2>
      </div>

      <div className="qa-form-group stagger-1">
        <label>AMOUNT</label>
        <div className="qa-amount-input">
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
        <label>CATEGORY</label>
        <CustomSelect 
          value={category}
          onChange={(val) => { setCategory(val); setError(''); }}
          placeholder="Select category..."
          options={[
            { value: 'Food', label: 'Food' },
            { value: 'Housing', label: 'Housing' },
            { value: 'Transport', label: 'Transport' },
            { value: 'Shopping', label: 'Shopping' },
            { value: 'Subscriptions', label: 'Subscriptions' },
            { value: 'Entertainment', label: 'Entertainment' },
            { value: 'Health', label: 'Health' },
            { value: 'Education', label: 'Education' },
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
        <label>PAYMENT METHOD</label>
        <CustomSelect 
          value={method}
          onChange={(val) => setMethod(val)}
          placeholder="Select method..."
          options={[
            { value: 'Cash', label: 'Cash' },
            { value: 'UPI', label: 'UPI' },
            { value: 'Card', label: 'Card' },
            { value: 'Bank Transfer', label: 'Bank Transfer' },
          ]}
        />
      </div>

      <div className="qa-form-group stagger-4">
        <label>NOTE</label>
        <input 
          type="text" 
          placeholder="e.g. Dinner with friends"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {error && <div className="qa-error-msg stagger-5">{error}</div>}

      <div className="qa-form-actions stagger-5">
        <button type="button" className="qa-btn-cancel" onClick={onCancel}>CANCEL</button>
        <button type="submit" className="qa-btn-primary">ADD EXPENSE →</button>
      </div>
    </form>
  );
};
