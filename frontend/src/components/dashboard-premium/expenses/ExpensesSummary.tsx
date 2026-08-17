import React, { useState, useEffect } from 'react';
import { Transaction } from '../../../data/mockTransactions';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface ExpensesSummaryProps {
  data: any; // Using the dashboardData shape
  transactions: Transaction[];
}

export const ExpensesSummary: React.FC<ExpensesSummaryProps> = ({ data, transactions }) => {
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const targetTotal = parseFloat(data.overview.monthlyExpenses.replace(/[^\d.]/g, ''));
  
  // Animate the main stat
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 600; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setAnimatedTotal(easeProgress * targetTotal);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [targetTotal]);

  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dailyAverage = targetTotal / (new Date().getDate() || 1); // rough avg for current month

  const highestCategory = data.spending.reduce((prev: any, current: any) => {
    const prevAmt = parseFloat(prev.amount.replace(/[^\d.]/g, ''));
    const currAmt = parseFloat(current.amount.replace(/[^\d.]/g, ''));
    return (prevAmt > currAmt) ? prev : current;
  });

  const expenseTxsCount = transactions.filter(t => t.type === 'expense').length;

  return (
    <div className="expenses-summary-grid">
      
      <div className="expense-stat-card">
        <span className="expense-stat-label">Total Spending</span>
        <span className="expense-stat-value">
          ₹{Math.floor(animatedTotal).toLocaleString('en-IN')}
        </span>
        <div className="expense-stat-subtext positive">
          <ArrowDownRight size={14} />
          <span>8.2% from last month</span>
        </div>
      </div>

      <div className="expense-stat-card">
        <span className="expense-stat-label">Daily Average</span>
        <span className="expense-stat-value">
          ₹{Math.round(dailyAverage).toLocaleString('en-IN')}
        </span>
        <div className="expense-stat-subtext">
          <span>This month</span>
        </div>
      </div>

      <div className="expense-stat-card">
        <span className="expense-stat-label">Largest Category</span>
        <span className="expense-stat-value">
          {highestCategory.amount}
        </span>
        <div className="expense-stat-subtext">
          <span style={{ textTransform: 'capitalize' }}>
            {highestCategory.category.toLowerCase()}
          </span>
        </div>
      </div>

      <div className="expense-stat-card">
        <span className="expense-stat-label">Transactions</span>
        <span className="expense-stat-value">
          {expenseTxsCount}
        </span>
        <div className="expense-stat-subtext">
          <span>Recorded expenses</span>
        </div>
      </div>

    </div>
  );
};
