import React, { useEffect, useState } from 'react';
import { Budget } from '../../../data/mockBudgetData';
import { Transaction } from '../../../data/mockTransactions';

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budgets, transactions, selectedMonth }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    // Calculate total budget for this month
    const currentBudgets = budgets.filter(b => b.month === selectedMonth);
    const sumBudget = currentBudgets.reduce((acc, b) => acc + b.limit, 0);
    
    // Calculate spent
    // Parse selectedMonth to filter transactions (rough approximation based on 'August 2026' string)
    const monthIndex = new Date(`${selectedMonth} 1`).getMonth();
    const year = new Date(`${selectedMonth} 1`).getFullYear();
    
    let sumSpent = 0;
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (tx.type === 'expense' && txDate.getMonth() === monthIndex && txDate.getFullYear() === year) {
        // Also ensure we only sum spent for categories that HAVE a budget? 
        // User requirements say "TOTAL BUDGET", "SPENT", "REMAINING". Usually this is across all budgets.
        const hasBudget = currentBudgets.some(b => b.category.toLowerCase() === tx.category.toLowerCase());
        if (hasBudget) {
          sumSpent += tx.amount;
        }
      }
    });

    setTotalBudget(sumBudget);
    setTotalSpent(sumSpent);
    
    // Animate progress
    setTimeout(() => {
      setProgressWidth(sumBudget > 0 ? Math.min((sumSpent / sumBudget) * 100, 100) : 0);
    }, 100);

  }, [budgets, transactions, selectedMonth]);

  const remaining = Math.max(totalBudget - totalSpent, 0);
  const healthPercent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="budget-glass-panel" style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="budget-subtitle">TOTAL BUDGET</div>
          <div className="budget-amount-large">₹{totalBudget.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="budget-subtitle">BUDGET HEALTH</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}>
            {healthPercent}% USED
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', padding: '20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>₹0</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>₹{totalBudget.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="budget-progress-container" style={{ height: '8px', background: 'rgba(255,255,255,0.05)' }}>
          <div 
            className="budget-progress-fill" 
            style={{ 
              width: `${progressWidth}%`,
              background: healthPercent > 100 ? '#C46C6C' : (healthPercent > 90 ? 'var(--accent-gold)' : 'var(--text-positive)')
            }} 
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{totalSpent.toLocaleString('en-IN')}</span> spent
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>₹{remaining.toLocaleString('en-IN')}</span> remaining
          </div>
        </div>
      </div>
    </div>
  );
};
