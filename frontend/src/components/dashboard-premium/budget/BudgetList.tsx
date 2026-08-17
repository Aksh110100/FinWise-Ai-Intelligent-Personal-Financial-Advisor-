import React, { useState, useEffect, useMemo } from 'react';
import { Budget, AVAILABLE_CATEGORIES } from '../../../data/mockBudgetData';
import { Transaction } from '../../../data/mockTransactions';
import { Search, MoreHorizontal, AlertCircle } from 'lucide-react';
import { FinWiseDropdown } from './BudgetSharedComponents';

interface BudgetListProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: string;
  onCategoryClick: (categoryName: string) => void;
  onEditClick: (id: string) => void;
  onDeleteClick: (id: string, categoryName: string) => void;
}

export const BudgetList: React.FC<BudgetListProps> = ({ 
  budgets, 
  transactions, 
  selectedMonth,
  onCategoryClick,
  onEditClick,
  onDeleteClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const monthIndex = new Date(`${selectedMonth} 1`).getMonth();
  const year = new Date(`${selectedMonth} 1`).getFullYear();

  const currentBudgets = budgets.filter(b => b.month === selectedMonth);

  const budgetData = useMemo(() => {
    return currentBudgets.map(b => {
      const spent = transactions
        .filter(tx => tx.type === 'expense' && tx.category.toLowerCase() === b.category.toLowerCase())
        .filter(tx => {
          const d = new Date(tx.date);
          return d.getMonth() === monthIndex && d.getFullYear() === year;
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      const remaining = Math.max(b.limit - spent, 0);
      const percent = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;

      let status = 'ON TRACK';
      if (percent >= 100) status = 'OVER BUDGET';
      else if (percent >= 90) status = 'NEAR LIMIT';
      else if (percent >= 70) status = 'WATCH';

      return { ...b, spent, remaining, percent, status };
    });
  }, [currentBudgets, transactions, monthIndex, year]);

  const filteredBudgets = budgetData.filter(b => {
    const matchSearch = b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || b.category === categoryFilter;
    let matchStatus = true;
    if (statusFilter === 'On Track') matchStatus = b.status === 'ON TRACK' || b.status === 'WATCH';
    if (statusFilter === 'Near Limit') matchStatus = b.status === 'NEAR LIMIT';
    if (statusFilter === 'Over Budget') matchStatus = b.status === 'OVER BUDGET';
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-secondary)', fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
          YOUR BUDGETS
        </h2>
      </div>

      <div className="budget-filters">
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="SEARCH BUDGETS..." 
            className="budget-search-input"
            style={{ paddingLeft: '36px', paddingRight: searchTerm ? '60px' : '16px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '12px', top: '10px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
            >
              CLEAR
            </button>
          )}
        </div>
        
        <div style={{ width: '180px' }}>
          <FinWiseDropdown 
            value={categoryFilter}
            options={['All', ...AVAILABLE_CATEGORIES]}
            onChange={setCategoryFilter}
            placeholder="ALL CATEGORIES"
          />
        </div>
        
        <div style={{ width: '160px' }}>
          <FinWiseDropdown 
            value={statusFilter}
            options={['All', 'On Track', 'Near Limit', 'Over Budget']}
            onChange={setStatusFilter}
            placeholder="STATUS"
          />
        </div>
      </div>

      <div className="budget-scrollable">
        <div className="budget-categories-grid">
          {filteredBudgets.map((b, i) => (
            <div 
              key={b.id} 
              className={`budget-category-row ${mounted ? 'budget-anim-enter' : ''}`}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => onCategoryClick(b.category)}
            >
              <div style={{ flex: 1 }}>
                <div className="budget-category-header">
                  <span className="budget-category-name">{b.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="budget-category-stats">
                      ₹{b.spent.toLocaleString('en-IN')} / ₹{b.limit.toLocaleString('en-IN')}
                    </span>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        // simplistic toggle, real app would use a proper dropdown component
                        const action = window.prompt(`Type 'edit' to adjust limit or 'delete' to remove ${b.category} budget`);
                        if (action === 'edit') onEditClick(b.id);
                        if (action === 'delete') onDeleteClick(b.id, b.category);
                      }}
                      style={{ padding: '4px', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <MoreHorizontal size={16} />
                    </div>
                  </div>
                </div>
                
                <div className="budget-progress-container">
                  <div 
                    className={`budget-progress-fill ${b.percent >= 100 ? 'status-over' : (b.percent >= 90 ? 'status-near' : '')}`}
                    style={{ width: mounted ? `${Math.min(b.percent, 100)}%` : '0%' }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: b.percent >= 100 ? '#C46C6C' : 'var(--text-secondary)' }}>
                    {b.percent}%
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {b.percent >= 100 && <AlertCircle size={14} color="#C46C6C" />}
                    <span style={{ fontSize: '0.85rem', color: b.percent >= 100 ? '#C46C6C' : 'var(--text-secondary)' }}>
                      {b.percent >= 100 ? `₹${(b.spent - b.limit).toLocaleString('en-IN')} over budget` : `₹${b.remaining.toLocaleString('en-IN')} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredBudgets.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No budgets found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
