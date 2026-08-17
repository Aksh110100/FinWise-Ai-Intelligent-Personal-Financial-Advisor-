import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';
import { mockTransactions, Transaction } from '../data/mockTransactions';
import { mockBudgets, Budget } from '../data/mockBudgetData';

interface DashboardContextType {
  dashboardData: typeof mockDashboardData;
  transactions: Transaction[];
  budgets: Budget[];
  simulatorSavings: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  addTransactions: (txs: Omit<Transaction, 'id'>[]) => { imported: number, duplicates: number };
  applyAIOptimization: (type: string, amount: number) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  setSimulatorSavings: (amount: number) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardDataState, setDashboardDataState] = useState(mockDashboardData);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [simulatorSavings, setSimulatorSavings] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('finwise_dashboard_data');
    if (savedData) {
      try {
        setDashboardDataState({ ...mockDashboardData, ...JSON.parse(savedData) });
      } catch (e) {
        console.error("Failed to parse saved dashboard data");
      }
    }

    const savedTxs = localStorage.getItem('finwise_transactions');
    if (savedTxs) {
      try {
        setTransactions(JSON.parse(savedTxs));
      } catch (e) {
        setTransactions(mockTransactions);
      }
    } else {
      setTransactions(mockTransactions);
      localStorage.setItem('finwise_transactions', JSON.stringify(mockTransactions));
    }
    
    const savedBudgets = localStorage.getItem('finwise_budgets');
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (e) {
        setBudgets(mockBudgets);
      }
    } else {
      setBudgets(mockBudgets);
      localStorage.setItem('finwise_budgets', JSON.stringify(mockBudgets));
    }
    
    setIsInitialized(true);
  }, []);

  // Dynamically calculate metrics based on transactions whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    // Category Breakdown
    const catMap = new Map<string, number>();
    expenses.forEach(t => {
      const current = catMap.get(t.category) || 0;
      catMap.set(t.category, current + t.amount);
    });
    
    const spendingArr = Array.from(catMap.entries()).map(([category, amount]) => ({
      category: category.toUpperCase(),
      amount: '₹' + amount.toLocaleString('en-IN'),
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
    })).sort((a, b) => b.percentage - a.percentage);
    
    // Update Dashboard Data State
    setDashboardDataState(prev => {
      const next = { ...prev };
      next.overview.monthlyExpenses = '₹' + totalExpenses.toLocaleString('en-IN');
      next.overview.monthlyIncome = '₹' + totalIncome.toLocaleString('en-IN');
      next.overview.currentBalance = '₹' + Math.max(0, totalIncome - totalExpenses).toLocaleString('en-IN');
      next.spending = spendingArr.length > 0 ? spendingArr : prev.spending;
      
      // Update monthly summary based on actuals
      next.monthlySummary.income = next.overview.monthlyIncome;
      next.monthlySummary.expenses = next.overview.monthlyExpenses;
      
      // Dynamically generate AI insight based on highest category
      if (spendingArr.length > 0) {
        const topCat = spendingArr[0];
        next.insights[0] = {
          title: `You spent more on ${topCat.category.toLowerCase()} this month.`,
          impactLabel: "POTENTIAL SAVING",
          impactValue: topCat.amount,
          impactYearly: '₹' + (parseFloat(topCat.amount.replace(/[^\d.]/g, '')) * 12).toLocaleString('en-IN'),
          actionLabel: "OPTIMIZE"
        };
      }
      
      // Update safe to spend logically
      const safeNum = Math.max(0, totalIncome - totalExpenses - 15000); // reserving some for savings mock
      next.safeToSpend.amount = '₹' + safeNum.toLocaleString('en-IN');
      
      localStorage.setItem('finwise_dashboard_data', JSON.stringify(next));
      return next;
    });
    
    localStorage.setItem('finwise_transactions', JSON.stringify(transactions));
  }, [transactions, isInitialized]);

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const addTransactions = (txs: Omit<Transaction, 'id'>[]) => {
    let imported = 0;
    let duplicates = 0;
    
    setTransactions(prev => {
      const next = [...prev];
      // Create a set of composite keys to quickly detect duplicates
      // Key: date(YYYY-MM-DD)_merchant_amount
      const existingKeys = new Set(
        prev.map(t => `${t.date.split('T')[0]}_${t.merchant.toLowerCase()}_${t.amount}`)
      );
      
      txs.forEach((tx, idx) => {
        const key = `${tx.date.split('T')[0]}_${tx.merchant.toLowerCase()}_${tx.amount}`;
        if (!existingKeys.has(key)) {
          next.push({
            ...tx,
            id: `tx-${Date.now()}-${idx}`
          });
          existingKeys.add(key);
          imported++;
        } else {
          duplicates++;
        }
      });
      
      // Sort descending by date
      next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return next;
    });
    
    return { imported, duplicates };
  };

  const applyAIOptimization = (type: string, amount: number) => {
    // Legacy mock optimization
    setDashboardDataState(prev => {
      const newData = { ...prev };
      if (type === 'spending' || type === 'subscription' || type === 'food' || type === 'housing') {
        const currentExp = parseFloat(newData.overview.monthlyExpenses.replace(/[^\d.]/g, ''));
        newData.overview.monthlyExpenses = '₹' + Math.max(0, currentExp - amount).toLocaleString('en-IN');
      }
      localStorage.setItem('finwise_dashboard_data', JSON.stringify(newData));
      return newData;
    });
  };

  const addBudget = (budgetData: Omit<Budget, 'id' | 'createdAt'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setBudgets(prev => {
      const next = [...prev, newBudget];
      localStorage.setItem('finwise_budgets', JSON.stringify(next));
      return next;
    });
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      localStorage.setItem('finwise_budgets', JSON.stringify(next));
      return next;
    });
  };

  const deleteBudget = (id: string) => {
    setBudgets(prev => {
      const next = prev.filter(b => b.id !== id);
      localStorage.setItem('finwise_budgets', JSON.stringify(next));
      return next;
    });
  };

  return (
    <DashboardContext.Provider value={{ 
      dashboardData: dashboardDataState, 
      transactions, 
      budgets,
      simulatorSavings,
      addTransaction,
      addTransactions,
      applyAIOptimization,
      addBudget,
      updateBudget,
      deleteBudget,
      setSimulatorSavings
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

