import React, { useState, useMemo, useEffect } from 'react';
import { Transaction } from '../../../data/mockTransactions';
import { FilterState } from './ExpenseFilters';
import { ArrowDownRight, ArrowUpRight, ChevronDown, ListFilter } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  filters: FilterState;
  onTransactionClick: (tx: Transaction) => void;
}

type SortOption = 'Newest' | 'Oldest' | 'Highest amount' | 'Lowest amount';

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, filters, onTransactionClick }) => {
  const [sortOption, setSortOption] = useState<SortOption>('Newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(tx => 
        tx.merchant.toLowerCase().includes(q) || 
        tx.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category !== 'All categories') {
      result = result.filter(tx => tx.category === filters.category);
    }

    // Payment Method
    if (filters.paymentMethod !== 'All') {
      result = result.filter(tx => tx.paymentMethod === filters.paymentMethod);
    }

    // Date Range (simple mock logic for demo)
    const now = new Date();
    if (filters.dateRange === 'Today') {
      result = result.filter(tx => new Date(tx.date).toDateString() === now.toDateString());
    } else if (filters.dateRange === 'This week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      result = result.filter(tx => new Date(tx.date) >= weekAgo);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortOption === 'Oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortOption === 'Highest amount') return b.amount - a.amount;
      if (sortOption === 'Lowest amount') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, filters, sortOption]);

  const toggleSort = () => setIsSortOpen(!isSortOpen);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.tx-sort-dropdown')) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="transactions-container">
      <div className="transactions-header" style={{ position: 'relative', zIndex: 10 }}>
        <h2>RECENT TRANSACTIONS</h2>
        
        <div className={`expense-filter-dropdown tx-sort-dropdown ${isSortOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="expense-filter-trigger" onClick={toggleSort} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
            SORT: {sortOption} <ChevronDown size={14} />
          </div>
          <div className="expense-filter-menu" style={{ width: '180px', right: 0, left: 'auto' }}>
            {['Newest', 'Oldest', 'Highest amount', 'Lowest amount'].map(opt => (
              <div 
                key={opt}
                className={`expense-filter-option ${sortOption === opt ? 'selected' : ''}`}
                onClick={() => { setSortOption(opt as SortOption); setIsSortOpen(false); }}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="transactions-scroll-area expenses-scrollbar">
        {filteredAndSorted.length === 0 ? (
          <div className="tx-empty-state">
            <ListFilter size={48} opacity={0.5} style={{ margin: '0 auto' }} />
            <h3>NO TRANSACTIONS FOUND</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredAndSorted.map(tx => (
            <div key={tx.id} className="transaction-row" onClick={() => onTransactionClick(tx)}>
              <div className="tx-icon">
                {tx.type === 'expense' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>
              <div className="tx-details">
                <div className="tx-merchant">{tx.merchant}</div>
                <div className="tx-meta">
                  <span>{tx.category}</span>
                  <span>·</span>
                  <span>{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  <span>·</span>
                  <span>{tx.paymentMethod}</span>
                </div>
              </div>
              <div className={`tx-amount ${tx.type}`}>
                {tx.type === 'expense' ? '− ' : '+ '}
                ₹{tx.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
