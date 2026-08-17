import React, { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface GoalFormProps {
  onCancel: () => void;
  onSuccess: (data: any, name: string) => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onCancel, onSuccess }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  const targetNum = parseFloat(target) || 0;
  const currentNum = parseFloat(current) || 0;
  
  // Calculate Progress Preview
  const progressPct = targetNum > 0 ? Math.min(100, Math.round((currentNum / targetNum) * 100)) : 0;
  const showPreview = name.length > 0 && targetNum > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Goal name cannot be empty.');
      return;
    }
    if (targetNum <= 0) {
      setError('Target amount must be greater than 0.');
      return;
    }
    if (currentNum > targetNum) {
      setError('Current savings cannot exceed the target amount.');
      return;
    }
    if (!date) {
      setError('Please select a target date.');
      return;
    }

    const data = { name, target: targetNum, current: currentNum, date, priority, progress: progressPct };
    onSuccess(data, name.toUpperCase());
  };

  return (
    <form className="qa-form" onSubmit={handleSubmit}>
      <div className="qa-form-header stagger-0">
        <div className="qa-ambient-glow"></div>
        <h2>CREATE A FINANCIAL GOAL</h2>
      </div>

      <div className="qa-form-group stagger-1">
        <label>GOAL NAME</label>
        <input 
          type="text" 
          placeholder="e.g. Emergency Fund" 
          value={name}
          onChange={(e) => { setName(e.target.value); setError(''); }}
          autoFocus
        />
      </div>

      <div className="qa-form-group stagger-2">
        <label>TARGET AMOUNT</label>
        <div className="qa-amount-input">
          <span>₹</span>
          <input 
            type="number" 
            placeholder="0.00" 
            value={target}
            onChange={(e) => { setTarget(e.target.value); setError(''); }}
            step="0.01"
          />
        </div>
      </div>

      <div className="qa-form-group stagger-3">
        <label>CURRENT SAVINGS</label>
        <div className="qa-amount-input" style={{ fontSize: '1.25rem', height: '40px' }}>
          <span>₹</span>
          <input 
            type="number" 
            placeholder="0.00" 
            value={current}
            onChange={(e) => { setCurrent(e.target.value); setError(''); }}
            step="0.01"
          />
        </div>
      </div>

      <div className="qa-form-row stagger-4">
        <div className="qa-form-group">
          <label>TARGET DATE</label>
          <input 
            type="month" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="qa-form-group">
          <label>PRIORITY</label>
          <CustomSelect 
            value={priority}
            onChange={(val) => setPriority(val)}
            options={[
              { value: 'Low', label: 'Low' },
              { value: 'Medium', label: 'Medium' },
              { value: 'High', label: 'High' },
            ]}
          />
        </div>
      </div>

      {showPreview && (
        <div className="qa-preview-box stagger-5">
          <div className="preview-header">
            <span className="preview-name">{name.toUpperCase()}</span>
          </div>
          <div className="preview-amounts">
            <span className="preview-current">₹{currentNum.toLocaleString('en-IN')}</span>
            <div className="preview-line"></div>
            <span className="preview-target">₹{targetNum.toLocaleString('en-IN')}</span>
          </div>
          <div className="preview-progress-bar">
            <div className="preview-progress-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <div className="preview-pct">{progressPct}% COMPLETE</div>
        </div>
      )}

      {error && <div className="qa-error-msg stagger-6">{error}</div>}

      <div className="qa-form-actions stagger-6">
        <button type="button" className="qa-btn-cancel" onClick={onCancel}>CANCEL</button>
        <button type="submit" className="qa-btn-primary">CREATE GOAL →</button>
      </div>
    </form>
  );
};
