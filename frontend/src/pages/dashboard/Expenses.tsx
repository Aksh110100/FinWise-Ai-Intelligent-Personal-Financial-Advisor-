import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import '../../styles/expenses.css';

// Components
import { ExpensesSummary } from '../../components/dashboard-premium/expenses/ExpensesSummary';
import { ExpenseFilters, FilterState } from '../../components/dashboard-premium/expenses/ExpenseFilters';
import { ExpenseGraph } from '../../components/dashboard-premium/expenses/ExpenseGraph';
import { CategoryAnalysis } from '../../components/dashboard-premium/expenses/CategoryAnalysis';
import { TransactionList } from '../../components/dashboard-premium/expenses/TransactionList';
import { AIExpenseAnalysis } from '../../components/dashboard-premium/expenses/AIExpenseAnalysis';
import { TransactionDetailPanel } from '../../components/dashboard-premium/expenses/TransactionDetailPanel';
import { QuickActionPanel, ActionType } from '../../components/dashboard-premium/QuickActionPanel';

import { Plus } from 'lucide-react';
import { Transaction } from '../../data/mockTransactions';

const Expenses: React.FC = () => {
  const { dashboardData, transactions, addTransaction } = useDashboard();
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All categories',
    paymentMethod: 'All',
    dateRange: 'This month'
  });

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleClearFilters = () => {
    setFilters({ search: '', category: 'All categories', paymentMethod: 'All', dateRange: 'This month' });
  };

  const handleAddExpenseSuccess = (data: any, actionType: ActionType) => {
    if (actionType) {
      addTransaction({
        merchant: data.name || 'Quick Action',
        category: data.category || 'General',
        date: data.date || new Date(),
        paymentMethod: data.paymentMethod || 'Bank Transfer',
        amount: data.amount,
        type: actionType === 'expense' ? 'expense' : 'income',
        note: data.note || ''
      });
    }
  };

  // Convert spending to proportional data
  const categoryData = dashboardData.spending.map(s => {
    const amountVal = parseFloat(s.amount.replace(/[^\d.]/g, ''));
    const totalExp = parseFloat(dashboardData.overview.monthlyExpenses.replace(/[^\d.]/g, ''));
    const percentage = totalExp > 0 ? Math.round((amountVal / totalExp) * 100) : 0;
    return {
      category: s.category,
      amount: s.amount,
      percentage
    };
  }).sort((a, b) => b.percentage - a.percentage);

  return (
    <>
      <div className="expenses-page-container anim-stagger-1">
      
      <div className="expenses-header">
        <div className="expenses-title-group">
          <h1>EXPENSES</h1>
          <p>Track where your money goes.</p>
        </div>
        <button className="premium-btn primary" onClick={() => setActiveAction('expense')}>
          <Plus size={16} />
          <span>ADD EXPENSE</span>
        </button>
      </div>

      <div className="anim-stagger-2">
        <ExpensesSummary data={dashboardData} transactions={transactions} />
      </div>

      <div className="anim-stagger-3" style={{ position: 'relative', zIndex: 10 }}>
        <ExpenseFilters 
          filters={filters} 
          onFilterChange={setFilters} 
          onClearFilters={handleClearFilters} 
        />
      </div>

      <div className="expenses-main-grid anim-stagger-4">
        {/* Graph Section */}
        <div className="expenses-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel-header">SPENDING OVERVIEW</div>
          <ExpenseGraph />
        </div>

        {/* Category Analysis */}
        <div className="expenses-panel">
          <div className="panel-header">WHERE YOUR MONEY GOES</div>
          <CategoryAnalysis data={categoryData} />
        </div>

        {/* AI Analysis */}
        <div className="expenses-panel">
          <div className="panel-header">FINWISE AI ANALYSIS</div>
          <AIExpenseAnalysis />
        </div>
      </div>

      <div className="anim-stagger-4" style={{ animationDelay: '0.5s' }}>
        <TransactionList 
          transactions={transactions} 
          filters={filters} 
          onTransactionClick={setSelectedTx} 
        />
      </div>
      </div>

      <TransactionDetailPanel 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
      />

      <QuickActionPanel 
        isOpen={activeAction !== null} 
        activeAction={activeAction} 
        onClose={() => setActiveAction(null)} 
        onSuccess={handleAddExpenseSuccess} 
      />
    </>
  );
};

export default Expenses;
