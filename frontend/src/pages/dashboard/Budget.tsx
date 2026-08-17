import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { BudgetOverview } from '../../components/dashboard-premium/budget/BudgetOverview';
import { BudgetList } from '../../components/dashboard-premium/budget/BudgetList';
import { BudgetGraph } from '../../components/dashboard-premium/budget/BudgetGraph';
import { BudgetAIAdvisor, RoomToSave } from '../../components/dashboard-premium/budget/BudgetAIAdvisor';
import { RecentBudgetActivity, EmptyBudgetState, DeleteConfirmModal } from '../../components/dashboard-premium/budget/BudgetSharedComponents';
import { CreateBudgetPanel, CategoryDetailPanel } from '../../components/dashboard-premium/budget/BudgetPanels';
import '../../styles/budget.css';

const Budget: React.FC = () => {
  const { budgets, transactions, addBudget, updateBudget, deleteBudget, applyAIOptimization } = useDashboard();
  
  const [toastConfig, setToastConfig] = useState<{ message: string; type: 'success' | 'decline' } | null>(null);
  
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [detailCategory, setDetailCategory] = useState<string | null>(null);
  
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string; categoryName: string }>({
    isOpen: false, id: '', categoryName: ''
  });

  // A fixed set of months for the demo to match requirement
  const availableMonths = ['June 2026', 'July 2026', 'August 2026', 'September 2026'];
  const selectedMonth = availableMonths[selectedMonthIndex] || 'August 2026';

  useEffect(() => {
    window.scrollTo(0, 0);
    // Default to August 2026 for the demo
    const idx = availableMonths.indexOf('August 2026');
    if (idx !== -1) setSelectedMonthIndex(idx);
  }, []);

  const handlePrevMonth = () => {
    if (selectedMonthIndex > 0) setSelectedMonthIndex(prev => prev - 1);
  };

  const handleNextMonth = () => {
    if (selectedMonthIndex < availableMonths.length - 1) setSelectedMonthIndex(prev => prev + 1);
  };

  const handleCreateBudget = (budgetData: any) => {
    addBudget(budgetData);
  };

  const handleAIOptimization = () => {
    applyAIOptimization('shopping', 1200);
    setToastConfig({ message: 'Budget Optimized', type: 'success' });
    setTimeout(() => setToastConfig(null), 3500);
  };

  const handleDeleteConfirm = () => {
    deleteBudget(deleteConfirm.id);
    setDeleteConfirm({ isOpen: false, id: '', categoryName: '' });
  };

  const currentBudgets = budgets.filter(b => b.month === selectedMonth);

  // Calculate spent for detail panel
  const getSpentForCategory = (category: string) => {
    const mIdx = new Date(`${selectedMonth} 1`).getMonth();
    const y = new Date(`${selectedMonth} 1`).getFullYear();
    return transactions
      .filter(tx => tx.type === 'expense' && tx.category.toLowerCase() === category.toLowerCase())
      .filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === mIdx && d.getFullYear() === y;
      })
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const totalBudget = currentBudgets.reduce((acc, b) => acc + b.limit, 0);
  const totalSpent = currentBudgets.reduce((acc, b) => acc + getSpentForCategory(b.category), 0);

  return (
    <div className="budget-page-container">
      
      {/* Header */}
      <div className="budget-header-flex anim-fade-up">
        <div>
          <h1 className="budget-title">BUDGET</h1>
          <div className="budget-subtitle" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
            "Give every rupee a purpose."
          </div>
          <div className="budget-subtitle">
            Set spending limits, track progress, and let FinWise AI help you stay on plan.
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreatePanelOpen(true)}
          style={{
            background: 'var(--accent-gold)',
            color: 'var(--bg-primary)',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontFamily: 'var(--font-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)'
          }}
        >
          + CREATE BUDGET
        </button>
      </div>

      {/* Month Selector */}
      <div className="anim-fade-up" style={{ animationDelay: '50ms' }}>
        <div className="budget-month-selector">
          <button className="budget-month-btn" onClick={handlePrevMonth} style={{ opacity: selectedMonthIndex === 0 ? 0.3 : 1 }}>
            <ChevronLeft size={20} />
          </button>
          
          <div className="budget-month-text">
            <span>{selectedMonth}</span>
            {selectedMonth === 'August 2026' && <span className="budget-month-indicator">THIS MONTH</span>}
          </div>
          
          <button className="budget-month-btn" onClick={handleNextMonth} style={{ opacity: selectedMonthIndex === availableMonths.length - 1 ? 0.3 : 1 }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {currentBudgets.length === 0 ? (
        <EmptyBudgetState onCreateClick={() => setIsCreatePanelOpen(true)} />
      ) : (
        <>
          <div className="anim-fade-up" style={{ animationDelay: '100ms' }}>
            <BudgetOverview budgets={budgets} transactions={transactions} selectedMonth={selectedMonth} />
          </div>

          <div className="budget-row anim-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="budget-col-main">
              <BudgetList 
                budgets={budgets}
                transactions={transactions}
                selectedMonth={selectedMonth}
                onCategoryClick={setDetailCategory}
                onEditClick={(id) => {
                  // A full app might open an edit panel. For this implementation, we just mock it.
                  alert("Edit budget feature would open here.");
                }}
                onDeleteClick={(id, categoryName) => setDeleteConfirm({ isOpen: true, id, categoryName })}
              />
              <BudgetGraph currentTotalBudget={totalBudget} currentTotalSpent={totalSpent} />
            </div>
            
            <div className="budget-col-side" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <BudgetAIAdvisor onOptimize={handleAIOptimization} />
              <RoomToSave />
              <RecentBudgetActivity />
            </div>
          </div>
        </>
      )}

      {/* Panels & Modals */}
      <CreateBudgetPanel 
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSubmit={handleCreateBudget}
        selectedMonth={selectedMonth}
      />

      <CategoryDetailPanel 
        category={detailCategory || ''}
        onClose={() => setDetailCategory(null)}
        budgets={budgets}
        selectedMonth={selectedMonth}
        spent={detailCategory ? getSpentForCategory(detailCategory) : 0}
      />

      <DeleteConfirmModal 
        isOpen={deleteConfirm.isOpen}
        categoryName={deleteConfirm.categoryName}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: '', categoryName: '' })}
      />

      {/* Toast Notification */}
      {toastConfig && (
        <div className="glass-toast">
          {toastConfig.type === 'success' ? (
            <Check size={18} color="var(--text-positive)" />
          ) : (
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '10px', height: '2px', backgroundColor: 'var(--text-secondary)' }}></div>
            </div>
          )}
          <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>{toastConfig.message}</span>
        </div>
      )}
    </div>
  );
};

export default Budget;
