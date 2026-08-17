import React, { useState, useEffect } from 'react';
import { mockDashboardData } from '../../data/mockDashboardData';

// Components
import { DashboardHeader } from '../../components/dashboard-premium/DashboardHeader';
import { KPIGrid } from '../../components/dashboard-premium/KPIGrid';
import { MainGraph } from '../../components/dashboard-premium/MainGraph';
import { SpendingDonut } from '../../components/dashboard-premium/SpendingDonut';
import { FinancialHealth } from '../../components/dashboard-premium/FinancialHealth';
import { AIInsightCard } from '../../components/dashboard-premium/AIInsightCard';
import { SavingsProgress } from '../../components/dashboard-premium/SavingsProgress';
import { InvestmentOverview } from '../../components/dashboard-premium/InvestmentOverview';
import { GoalList } from '../../components/dashboard-premium/GoalList';
import { QuickActions } from '../../components/dashboard-premium/QuickActions';
import { QuickActionPanel, ActionType } from '../../components/dashboard-premium/QuickActionPanel';
import { useDashboard } from '../../context/DashboardContext';
import { Check } from 'lucide-react';

const Overview: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [toastConfig, setToastConfig] = useState<{ message: string; type: 'success' | 'decline' } | null>(null);

  const { dashboardData, addTransaction, applyAIOptimization } = useDashboard();

  useEffect(() => {
    window.scrollTo(0, 0);
    const userData = localStorage.getItem('finwise_user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || dashboardData.user.firstName);
      } catch (e) {
        setUserName(dashboardData.user.firstName);
      }
    } else {
      setUserName(dashboardData.user.firstName);
    }
  }, []);

  const handleActionSuccess = (data: any, actionType: ActionType) => {
    // Instead of local state manipulation, we push a transaction to the context
    // and let it handle dashboard stat updates.
    if (!actionType) return;
    addTransaction({
      merchant: data.name || 'Quick Action',
      category: data.category || 'General',
      date: data.date || new Date(),
      paymentMethod: data.paymentMethod || 'Bank Transfer',
      amount: data.amount,
      type: actionType === 'expense' ? 'expense' : 'income',
      note: data.note || ''
    });
  };

  const handleAIOptimization = (type: string) => {
    applyAIOptimization(type, 2400); // 2400 is the hardcoded mock optimization amount for this demo
    setToastConfig({ message: 'Optimization Applied', type: 'success' });
    setTimeout(() => setToastConfig(null), 3500);
  };

  const handleAIDecline = () => {
    setToastConfig({ message: 'Optimization Declined', type: 'decline' });
    setTimeout(() => setToastConfig(null), 3500);
  };

  return (
    <>
      <div className="dashboard-content-grid">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
          <DashboardHeader userName={userName} />
          <div style={{ paddingTop: '16px' }}>
            <QuickActions onActionClick={(a) => setActiveAction(a as ActionType)} />
          </div>
        </div>
        
        <KPIGrid data={dashboardData.overview} />

        <div className="dashboard-row-2">
          <MainGraph />
          <SpendingDonut categories={dashboardData.spending} total={dashboardData.overview.monthlyExpenses} />
        </div>

        <div className="dashboard-row-3">
          <FinancialHealth score={dashboardData.health.score} />
          <AIInsightCard onActionClick={handleAIOptimization} onDeclineClick={handleAIDecline} />
          <SavingsProgress />
        </div>

        <div className="dashboard-row-2">
          <InvestmentOverview />
          <GoalList goals={dashboardData.goals} />
        </div>

      </div>

      <QuickActionPanel 
        isOpen={activeAction !== null} 
        activeAction={activeAction} 
        onClose={() => setActiveAction(null)} 
        onSuccess={handleActionSuccess} 
      />
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
    </>
  );
};

export default Overview;
