import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  paymentMethod: string;
  dateRange: string;
}

interface ExpenseFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const CATEGORIES = ['All categories', 'Housing', 'Food', 'Transport', 'Shopping', 'Subscriptions', 'Entertainment', 'Health', 'Education', 'Other'];
const PAYMENT_METHODS = ['All', 'UPI', 'Card', 'Cash', 'Bank Transfer'];
const DATE_RANGES = ['Today', 'This week', 'This month', 'Last month', 'Last 3 months', 'This year'];

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.expense-filter-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSelect = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
    setOpenDropdown(null);
  };

  const hasActiveFilters = filters.category !== 'All categories' || 
                           filters.paymentMethod !== 'All' || 
                           filters.dateRange !== 'This month';

  return (
    <>
      <div className="expenses-filter-bar">
        
        {/* Search */}
        <div className="expense-search-wrapper">
          <Search size={16} className="expense-search-icon" />
          <input 
            type="text" 
            className="expense-search-input" 
            placeholder="Search expenses..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Date Range Dropdown */}
        <div className={`expense-filter-dropdown ${openDropdown === 'date' ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="expense-filter-trigger" onClick={() => toggleDropdown('date')}>
            {filters.dateRange.toUpperCase()} <ChevronDown size={14} />
          </div>
          <div className="expense-filter-menu">
            {DATE_RANGES.map(range => (
              <div 
                key={range} 
                className={`expense-filter-option ${filters.dateRange === range ? 'selected' : ''}`}
                onClick={() => handleSelect('dateRange', range)}
              >
                {range}
              </div>
            ))}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className={`expense-filter-dropdown ${openDropdown === 'category' ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="expense-filter-trigger" onClick={() => toggleDropdown('category')}>
            CATEGORY <ChevronDown size={14} />
          </div>
          <div className="expense-filter-menu">
            {CATEGORIES.map(cat => (
              <div 
                key={cat} 
                className={`expense-filter-option ${filters.category === cat ? 'selected' : ''}`}
                onClick={() => handleSelect('category', cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Dropdown */}
        <div className={`expense-filter-dropdown ${openDropdown === 'payment' ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="expense-filter-trigger" onClick={() => toggleDropdown('payment')}>
            PAYMENT <ChevronDown size={14} />
          </div>
          <div className="expense-filter-menu">
            {PAYMENT_METHODS.map(method => (
              <div 
                key={method} 
                className={`expense-filter-option ${filters.paymentMethod === method ? 'selected' : ''}`}
                onClick={() => handleSelect('paymentMethod', method)}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          {filters.category !== 'All categories' && (
            <div className="filter-pill">
              {filters.category} 
              <button onClick={() => handleSelect('category', 'All categories')}><X size={12} /></button>
            </div>
          )}
          {filters.paymentMethod !== 'All' && (
            <div className="filter-pill">
              {filters.paymentMethod} 
              <button onClick={() => handleSelect('paymentMethod', 'All')}><X size={12} /></button>
            </div>
          )}
          {filters.dateRange !== 'This month' && (
            <div className="filter-pill">
              {filters.dateRange} 
              <button onClick={() => handleSelect('dateRange', 'This month')}><X size={12} /></button>
            </div>
          )}
          
          <button className="clear-filters-btn" onClick={onClearFilters}>
            CLEAR ALL
          </button>
        </div>
      )}
    </>
  );
};
