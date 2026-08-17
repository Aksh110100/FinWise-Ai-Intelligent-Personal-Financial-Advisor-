import React, { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface InvestmentFormProps {
  onCancel: () => void;
  onSuccess: (data: any, amountFormatted: string) => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onCancel, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [horizon, setHorizon] = useState('5');
  const [risk, setRisk] = useState('Moderate');
  const [goal, setGoal] = useState('Wealth Growth');
  const [error, setError] = useState('');

  const amountNum = parseFloat(amount) || 0;
  const years = parseInt(horizon) || 0;
  
  // Calculate Live Projection (Frontend Only)
  // Simplified compound interest math
  let expectedRate = 0.12; // Moderate = 12%
  if (risk === 'Conservative') expectedRate = 0.08;
  if (risk === 'Aggressive') expectedRate = 0.15;

  const totalContribution = amountNum * 12 * years;
  
  // Future Value of a Series formula: PMT * (((1 + r/n)^(nt) - 1) / (r/n))
  const monthlyRate = expectedRate / 12;
  const months = years * 12;
  const projectedFutureValue = amountNum * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  const showProjection = amountNum > 0 && years > 0;

  const formatLakhs = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountNum <= 0) {
      setError('Monthly investment must be greater than 0.');
      return;
    }

    const data = { amount: amountNum, horizon: years, risk, goal, projected: projectedFutureValue };
    const formattedAmount = '₹ ' + amountNum.toLocaleString('en-IN');
    onSuccess(data, formattedAmount);
  };

  return (
    <form className="qa-form" onSubmit={handleSubmit}>
      <div className="qa-form-header stagger-0">
        <div className="qa-ambient-glow"></div>
        <h2>PLAN YOUR INVESTMENT</h2>
      </div>

      <div className="qa-form-group stagger-1">
        <label>MONTHLY AMOUNT</label>
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
        <label>TIME HORIZON</label>
        <CustomSelect 
          value={horizon}
          onChange={(val) => setHorizon(val)}
          options={[
            { value: '1', label: '1 Year' },
            { value: '3', label: '3 Years' },
            { value: '5', label: '5 Years' },
            { value: '10', label: '10 Years' },
          ]}
        />
      </div>

      <div className="qa-form-row stagger-3">
        <div className="qa-form-group">
          <label>RISK PROFILE</label>
          <CustomSelect 
            value={risk}
            onChange={(val) => setRisk(val)}
            options={[
              { value: 'Conservative', label: 'Conservative' },
              { value: 'Moderate', label: 'Moderate' },
              { value: 'Aggressive', label: 'Aggressive' },
            ]}
          />
        </div>
        <div className="qa-form-group">
          <label>GOAL</label>
          <CustomSelect 
            value={goal}
            onChange={(val) => setGoal(val)}
            options={[
              { value: 'Wealth Growth', label: 'Wealth Growth' },
              { value: 'Emergency Fund', label: 'Emergency Fund' },
              { value: 'Retirement', label: 'Retirement' },
              { value: 'Education', label: 'Education' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>
      </div>

      {showProjection && (
        <div className="qa-preview-box stagger-4">
          <div className="projection-grid">
            <div className="proj-item">
              <span>MONTHLY INVESTMENT</span>
              <strong className="text-gold">₹{amountNum.toLocaleString('en-IN')}</strong>
            </div>
            <div className="proj-item">
              <span>{years} YEAR HORIZON</span>
            </div>
            <div className="proj-item">
              <span>ESTIMATED CONTRIBUTION</span>
              <strong>{formatLakhs(totalContribution)}</strong>
            </div>
            <div className="proj-item">
              <span>PROJECTED RANGE</span>
              <strong className="text-emerald">
                {formatLakhs(projectedFutureValue * 0.9)} – {formatLakhs(projectedFutureValue * 1.1)}
              </strong>
            </div>
          </div>
          <p className="proj-disclaimer">Illustrative projection — not financial advice.</p>
        </div>
      )}

      {error && <div className="qa-error-msg stagger-5">{error}</div>}

      <div className="qa-form-actions stagger-5">
        <button type="button" className="qa-btn-cancel" onClick={onCancel}>CANCEL</button>
        <button type="submit" className="qa-btn-primary">PLAN INVESTMENT →</button>
      </div>
    </form>
  );
};
