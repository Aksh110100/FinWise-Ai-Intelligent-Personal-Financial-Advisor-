import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Target, Plus, Shield, Laptop, Plane, Home, Car, Star, 
  MoreHorizontal, X, AlertCircle, CheckCircle, ArrowRight, Sparkles, TrendingUp, Check
} from 'lucide-react';
import { initialGoals, goalAnalytics, aiInsight, Goal } from '../../data/goalsData';
import '../../styles/goals.css';

// --- Helpers ---
const calculateMonthsRemaining = (current: number, target: number, monthly: number) => {
  if (current >= target) return 0;
  if (monthly <= 0) return -1; // Never
  return Math.ceil((target - current) / monthly);
};

const getEstimatedDate = (currentDateStr: string, monthsRemaining: number) => {
  if (monthsRemaining === -1) return 'Never';
  const d = new Date();
  d.setMonth(d.getMonth() + monthsRemaining);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
};

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'Safety': return <Shield size={20} />;
    case 'Personal': return <Laptop size={20} />;
    case 'Lifestyle': return <Plane size={20} />;
    case 'Major Purchase': return <Home size={20} />;
    case 'Education': return <Star size={20} />;
    default: return <Target size={20} />;
  }
};

const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

// --- Custom Tooltip ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '8px', backdropFilter: 'blur(10px)' }}>
        <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>{data.month.toUpperCase()}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>PLANNED</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}>{formatCurrency(data.planned)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--accent-gold)' }}>ACTUAL</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--accent-gold)', fontFamily: 'var(--font-primary)' }}>{formatCurrency(data.actual)}</span>
        </div>
      </div>
    );
  }
  return null;
};

// --- Main Component ---
export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'ON TRACK' | 'AT RISK' | 'COMPLETED'>('ALL');
  const [sortBy, setSortBy] = useState<'Target Date' | 'Progress' | 'Priority'>('Target Date');
  
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'contribution' | 'delete' | null>(null);
  const [activePanel, setActivePanel] = useState<'details' | 'optimize' | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [isClosing, setIsClosing] = useState(false);
  const [successType, setSuccessType] = useState<string | null>(null);

  const closePanel = () => {
    setIsClosing(true);
    setTimeout(() => {
      setActivePanel(null);
      setIsClosing(false);
      setSuccessType(null);
    }, 400);
  };

  const handleSuccessAction = (type: string) => {
    setSuccessType(type);
    setTimeout(() => {
      closePanel();
    }, 2000);
  };

  // Derived state
  const selectedGoal = goals.find(g => g.id === selectedGoalId) || null;
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  
  const activeGoalsCount = goals.filter(g => g.status !== 'COMPLETED').length;
  const completedGoalsCount = goals.filter(g => g.status === 'COMPLETED').length;
  const onTrackCount = goals.filter(g => g.status === 'ON TRACK').length;

  // Filtering & Sorting
  const filteredGoals = useMemo(() => {
    let filtered = goals;
    if (filter === 'ACTIVE') filtered = goals.filter(g => g.status !== 'COMPLETED');
    if (filter === 'ON TRACK') filtered = goals.filter(g => g.status === 'ON TRACK');
    if (filter === 'AT RISK') filtered = goals.filter(g => g.status === 'AT RISK');
    if (filter === 'COMPLETED') filtered = goals.filter(g => g.status === 'COMPLETED');

    return filtered.sort((a, b) => {
      if (sortBy === 'Target Date') return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      if (sortBy === 'Progress') return (a.currentAmount / a.targetAmount) - (b.currentAmount / b.targetAmount);
      if (sortBy === 'Priority') {
        const pScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return pScore[b.priority] - pScore[a.priority];
      }
      return 0;
    });
  }, [goals, filter, sortBy]);

  // Handlers
  const handleAction = (goalId: string, action: 'edit' | 'contribution' | 'details' | 'delete') => {
    setSelectedGoalId(goalId);
    setOpenMenuId(null);
    if (action === 'details' || action === 'edit' || action === 'contribution' || action === 'delete') {
      if (action === 'details') setActivePanel('details');
      else setActiveModal(action);
    }
  };

  const deleteGoal = () => {
    if (selectedGoalId) {
      setGoals(goals.filter(g => g.id !== selectedGoalId));
      setActiveModal(null);
      setSelectedGoalId(null);
    }
  };

  const saveGoal = (newGoal: Goal) => {
    // Recalculate status and progress
    if (newGoal.currentAmount >= newGoal.targetAmount) {
      newGoal.currentAmount = newGoal.targetAmount;
      newGoal.status = 'COMPLETED';
    } else if (newGoal.status === 'COMPLETED') {
      newGoal.status = 'ON TRACK'; // Reverted
    }

    if (selectedGoalId && activeModal === 'edit') {
      setGoals(goals.map(g => g.id === selectedGoalId ? newGoal : g));
    } else {
      setGoals([...goals, { ...newGoal, id: `g${Date.now()}` }]);
    }
    setActiveModal(null);
  };

  const addContribution = (amount: number) => {
    if (selectedGoal) {
      const updated = { ...selectedGoal, currentAmount: selectedGoal.currentAmount + amount };
      saveGoal(updated);
      setActiveModal(null);
    }
  };

  return (
    <div className="goals-container page-transition-wrapper entering">
      <div className="goals-glow-bg" />

      {/* Header */}
      <header className="dashboard-header goals-animate-fade-up" style={{ flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ flex: '1 1 300px', minWidth: 0 }}>
            <h1 className="header-title">GOALS</h1>
            <p className="header-subtext" style={{letterSpacing: '0.05em'}}>Turn your plans into progress.</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '8px' }}>
              Set financial goals, track every milestone, and see what it will take to reach them.
            </p>
          </div>
          <button 
            className="dashboard-quick-btn" 
            onClick={() => { setSelectedGoalId(null); setActiveModal('create'); }}
            style={{ background: 'var(--text-primary)', color: '#000', border: 'none' }}
          >
            <Plus size={16} />
            <span>CREATE GOAL</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}>{activeGoalsCount}</strong> ACTIVE GOALS
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--accent-gold)' }}>
            <strong style={{ fontFamily: 'var(--font-primary)' }}>{formatCurrency(totalSaved)}</strong> SAVED
          </div>
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}>{formatCurrency(totalTarget - totalSaved)}</strong> REMAINING
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="goals-animate-fade-up delay-100" style={{ width: '100%', boxSizing: 'border-box', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="dashboard-quick-btn" onClick={() => { setSelectedGoalId(null); setActiveModal('create'); }}>
            <Plus size={16} /> <span>CREATE GOAL</span>
          </button>
          <button className="dashboard-quick-btn" onClick={() => { 
            const activeGoal = goals.find(g => g.status !== 'COMPLETED');
            if (activeGoal) { setSelectedGoalId(activeGoal.id); setActiveModal('contribution'); } 
          }}>
            <Target size={16} /> <span>ADD CONTRIBUTION</span>
          </button>
          <button className="dashboard-quick-btn" onClick={() => setActivePanel('optimize')}>
            <Sparkles size={16} /> <span>OPTIMIZE GOALS</span>
          </button>
          <button className="dashboard-quick-btn" onClick={() => {
            document.getElementById('goals-timeline-section')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <TrendingUp size={16} /> <span>VIEW TIMELINE</span>
          </button>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="glass-card goals-animate-fade-up delay-100" style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '16px' }}>YOUR FINANCIAL GOALS</h3>
        <div className="goals-summary-grid">
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>TOTAL GOALS</div>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{goals.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>ACTIVE</div>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-primary)' }}>{activeGoalsCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>COMPLETED</div>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-positive)' }}>{completedGoalsCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>ON TRACK</div>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>{onTrackCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="goals-animate-fade-up delay-200" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', boxSizing: 'border-box', flexWrap: 'wrap', gap: '16px' }}>
        <div className="goals-filter-bar">
          {['ALL', 'ACTIVE', 'ON TRACK', 'AT RISK', 'COMPLETED'].map(f => (
            <button 
              key={f} 
              className={`goals-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f as any)}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-secondary)', letterSpacing: '0.05em' }}>SORT BY</span>
          <select 
            className="goals-select" 
            style={{ padding: '4px 32px 4px 12px', fontSize: '0.75rem', background: 'transparent' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="Target Date">Target Date</option>
            <option value="Progress">Progress</option>
            <option value="Priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="goals-grid goals-animate-fade-up delay-300" style={{ width: '100%', boxSizing: 'border-box' }}>
        {filteredGoals.map(goal => {
          const progressPct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          const isCompleted = goal.status === 'COMPLETED';
          const isAtRisk = goal.status === 'AT RISK';

          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-card-header">
                <div className="goal-icon-wrapper">
                  {getIconForCategory(goal.category)}
                </div>
                <div style={{ position: 'relative' }}>
                  <button className="goal-menu-btn" onClick={() => setOpenMenuId(openMenuId === goal.id ? null : goal.id)}>
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenuId === goal.id && (
                    <div className="goal-dropdown-menu">
                      <button className="goal-dropdown-item" onClick={() => handleAction(goal.id, 'edit')}>EDIT GOAL</button>
                      {!isCompleted && <button className="goal-dropdown-item" onClick={() => handleAction(goal.id, 'contribution')}>ADD CONTRIBUTION</button>}
                      <button className="goal-dropdown-item" onClick={() => handleAction(goal.id, 'details')}>VIEW DETAILS</button>
                      <button className="goal-dropdown-item danger" onClick={() => handleAction(goal.id, 'delete')}>DELETE GOAL</button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  {goal.category}
                </div>
                <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.125rem', margin: 0, color: 'var(--text-primary)' }}>
                  {goal.name}
                </h4>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {formatCurrency(goal.currentAmount)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  of {formatCurrency(goal.targetAmount)}
                </div>
              </div>

              <div className="goal-progress-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-primary)' }}>{progressPct.toFixed(1)}%</span>
                </div>
                <div className="goal-progress-track">
                  <div 
                    className={`goal-progress-fill ${isCompleted ? 'completed' : isAtRisk ? 'at-risk' : ''}`} 
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {isCompleted ? '-' : `${formatCurrency(goal.monthlyContribution)} / month`}
                </div>
                <div style={{ 
                  fontSize: '0.65rem', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  letterSpacing: '0.05em',
                  background: isCompleted ? 'rgba(46, 204, 113, 0.1)' : isAtRisk ? 'rgba(245, 158, 11, 0.1)' : 'rgba(201, 164, 108, 0.1)',
                  color: isCompleted ? 'var(--text-positive)' : isAtRisk ? '#f59e0b' : 'var(--accent-gold)'
                }}>
                  {goal.status}
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredGoals.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', width: '100%', boxSizing: 'border-box' }}>
            <Target size={32} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', marginBottom: '8px' }}>NO GOALS FOUND</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px' }}>Try another filter or create a new financial goal.</p>
            <button className="goals-primary-btn" onClick={() => { setSelectedGoalId(null); setActiveModal('create'); }}>CREATE GOAL</button>
          </div>
        )}
      </div>

      {/* Overall Progress + Analytics Grid */}
      <div className="goals-analytics-grid goals-animate-fade-up delay-300">
        {/* Goal Analytics */}
        <div className="glass-card" style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '24px' }}>GOAL PROGRESS</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={goalAnalytics} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-gold)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-gold)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                <Area type="monotone" dataKey="planned" stroke="rgba(255,255,255,0.2)" strokeWidth={2} fillOpacity={1} fill="url(#colorPlanned)" />
                <Area type="monotone" dataKey="actual" stroke="var(--accent-gold)" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '24px', alignSelf: 'flex-start' }}>OVERALL PROGRESS</h3>
          
          <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle 
                cx="100" cy="100" r="90" 
                fill="none" 
                stroke="var(--accent-gold)" 
                strokeWidth="12" 
                strokeDasharray={`${(overallProgress / 100) * (2 * Math.PI * 90)} ${2 * Math.PI * 90}`}
                style={{ transition: 'stroke-dasharray 1s ease' }}
              />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: '2rem', color: 'var(--text-primary)' }}>{overallProgress.toFixed(1)}%</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>ACHIEVED</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '32px', padding: '0 16px', boxSizing: 'border-box' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL SAVED</div>
              <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.125rem', color: 'var(--accent-gold)' }}>{formatCurrency(totalSaved)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>TOTAL TARGET</div>
              <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.125rem', color: 'var(--text-primary)' }}>{formatCurrency(totalTarget)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Timeline */}
      <div id="goals-timeline-section" className="glass-card goals-animate-fade-up delay-400" style={{ padding: '24px', width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
        <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '24px' }}>YOUR GOAL TIMELINE</h3>
        <div className="goals-timeline">
          {[...goals].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()).map(goal => {
            const isCompleted = goal.status === 'COMPLETED';
            const isAtRisk = goal.status === 'AT RISK';
            return (
              <div key={`timeline-${goal.id}`} className="timeline-event">
                <div className={`timeline-dot ${isCompleted ? 'completed' : isAtRisk ? 'at-risk' : 'upcoming'}`} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-primary)', marginBottom: '4px' }}>{goal.name}</div>
                <div style={{ fontSize: '0.65rem', color: isCompleted ? 'var(--text-positive)' : isAtRisk ? '#f59e0b' : 'var(--accent-gold)', letterSpacing: '0.05em' }}>
                  {goal.status}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What-If Simulator Placeholder */}
      <div className="glass-card goals-animate-fade-up delay-400" style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '24px' }}>WHAT-IF SIMULATOR</h3>
        <div className="goals-simulator-grid">
           <div>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
               Select a goal to simulate how changes to your monthly contribution affect your timeline.
             </p>
             <button className="goals-quick-btn" onClick={() => setActivePanel('optimize')} style={{ padding: '0 16px', display: 'inline-flex', width: 'auto' }}>
               OPEN SIMULATOR <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px' }} />
             </button>
           </div>
           <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Click "Open Simulator" to start</span>
           </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="glass-card goals-animate-fade-up delay-400" style={{ padding: '24px', border: '1px solid rgba(201, 164, 108, 0.2)', background: 'linear-gradient(135deg, rgba(201, 164, 108, 0.05) 0%, rgba(10,10,10,0.45) 100%)', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>{aiInsight.title}</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '24px' }}>
          {aiInsight.message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <button 
            className="goals-quick-btn" 
            style={{ padding: '0 16px', width: 'auto' }}
            onClick={() => setActivePanel('optimize')}
          >
            OPTIMIZE GOALS <ArrowRight size={14} style={{ display: 'inline', marginLeft: '4px', verticalAlign: 'middle' }} />
          </button>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>AI INSIGHT — DEMO</span>
        </div>
      </div>

      {/* Goal Priority */}
      <div className="glass-card goals-animate-fade-up delay-400" style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '24px' }}>GOAL PRIORITY</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {['High', 'Medium', 'Low'].map(prio => {
            const priorityGoals = goals.filter(g => g.priority === prio);
            if (priorityGoals.length === 0) return null;
            return (
              <div key={prio}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{prio}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {priorityGoals.map(g => (
                    <div key={`prio-${g.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{g.name}</span>
                      <span style={{ fontSize: '0.75rem', color: g.status === 'COMPLETED' ? 'var(--text-positive)' : g.status === 'AT RISK' ? '#f59e0b' : 'var(--text-secondary)' }}>{g.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Goals */}
      {(filter === 'ALL' || filter === 'COMPLETED') && completedGoalsCount > 0 && (
        <div className="goals-animate-fade-up delay-400" style={{ marginTop: '16px', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '16px' }}>COMPLETED GOALS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {goals.filter(g => g.status === 'COMPLETED').map(goal => (
              <div key={goal.id} className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.7, width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="goal-icon-wrapper" style={{ width: '32px', height: '32px' }}>{getIconForCategory(goal.category)}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1rem' }}>{goal.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formatCurrency(goal.targetAmount)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-positive)' }}>100%</div>
                  <button className="icon-btn" onClick={() => handleAction(goal.id, 'details')}><ArrowRight size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Modals & Panels --- */}
      <CreateEditModal 
        isOpen={activeModal === 'create' || activeModal === 'edit'} 
        onClose={() => setActiveModal(null)} 
        goal={activeModal === 'edit' ? selectedGoal : null}
        onSave={saveGoal}
      />

      <ContributionModal 
        isOpen={activeModal === 'contribution'} 
        onClose={() => setActiveModal(null)}
        goal={selectedGoal}
        onSave={addContribution}
      />

      <DeleteModal 
        isOpen={activeModal === 'delete'} 
        onClose={() => setActiveModal(null)}
        goal={selectedGoal}
        onConfirm={deleteGoal}
      />

      {/* Goal Details Side Panel */}
      {activePanel === 'details' && selectedGoal && (
        <div className="goals-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setActivePanel(null); }}>
          <div className="goals-side-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="goal-icon-wrapper">{getIconForCategory(selectedGoal.category)}</div>
                <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{selectedGoal.name}</h2>
              </div>
              <button className="icon-btn" onClick={() => setActivePanel(null)}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0' }}>
              <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle 
                    cx="100" cy="100" r="90" 
                    fill="none" 
                    stroke={selectedGoal.status === 'COMPLETED' ? 'var(--text-positive)' : 'var(--accent-gold)'} 
                    strokeWidth="8" 
                    strokeDasharray={`${((selectedGoal.currentAmount / selectedGoal.targetAmount)) * (2 * Math.PI * 90)} ${2 * Math.PI * 90}`}
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-primary)', fontSize: '2.5rem' }}>
                    {Math.min(100, (selectedGoal.currentAmount / selectedGoal.targetAmount) * 100).toFixed(0)}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>PROGRESS</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>CURRENT</div>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{formatCurrency(selectedGoal.currentAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>TARGET</div>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{formatCurrency(selectedGoal.targetAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>REMAINING</div>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{formatCurrency(Math.max(0, selectedGoal.targetAmount - selectedGoal.currentAmount))}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>MONTHLY CONTRIBUTION</div>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{formatCurrency(selectedGoal.monthlyContribution)}</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ESTIMATED COMPLETION</span>
                <span style={{ fontFamily: 'var(--font-primary)' }}>
                  {selectedGoal.status === 'COMPLETED' ? 'ACHIEVED' : getEstimatedDate(new Date().toISOString(), calculateMonthsRemaining(selectedGoal.currentAmount, selectedGoal.targetAmount, selectedGoal.monthlyContribution))}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>TARGET DATE</span>
                <span style={{ fontFamily: 'var(--font-primary)' }}>{new Date(selectedGoal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>STATUS</span>
                <span style={{ fontFamily: 'var(--font-primary)', color: selectedGoal.status === 'ON TRACK' ? 'var(--text-positive)' : selectedGoal.status === 'AT RISK' ? '#f59e0b' : 'var(--text-positive)' }}>
                  {selectedGoal.status}
                </span>
              </div>
            </div>

            <Simulator selectedGoal={selectedGoal} />

            <div style={{ marginTop: 'auto', paddingTop: '32px', display: 'flex', gap: '16px' }}>
              <button className="goals-primary-btn" style={{ flex: 1 }} onClick={() => { setActivePanel(null); setActiveModal('edit'); }}>EDIT GOAL</button>
              {!Number.isNaN(selectedGoal.targetAmount) && selectedGoal.status !== 'COMPLETED' && (
                <button className="goals-secondary-btn" style={{ flex: 1 }} onClick={() => { setActivePanel(null); setActiveModal('contribution'); }}>ADD FUNDS</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Panels using portal */}
      {activePanel && activePanel === 'optimize' && createPortal(
        <div className={`qa-overlay center ${isClosing ? 'closing' : 'opening'}`} onClick={closePanel}>
          <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
            <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
            <div className="qa-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {successType !== 'optimize' ? (
                <>
                  <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', marginBottom: '20px', textTransform: 'uppercase' }}>OPTIMIZE YOUR GOALS</h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '12px 16px', background: 'rgba(201, 164, 108, 0.1)', borderRadius: '8px', color: 'var(--accent-gold)' }}>
                    <Sparkles size={16} />
                    <span style={{ fontSize: '0.875rem' }}>AI suggestions to keep you on track.</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                    {goals.filter(g => g.status !== 'COMPLETED').map(goal => (
                      <div key={goal.id} className="glass-card" style={{ padding: '12px 16px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', flexShrink: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>{goal.name}</div>
                          <div style={{ fontSize: '0.75rem', color: goal.status === 'ON TRACK' ? 'var(--text-positive)' : '#f59e0b', letterSpacing: '0.05em' }}>{goal.status}</div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Contribution</span>
                          <span style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9rem' }}>{formatCurrency(goal.monthlyContribution)}/mo</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recommended</span>
                          <span style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-primary)', fontSize: '0.9rem' }}>
                            {goal.status === 'AT RISK' ? formatCurrency(goal.monthlyContribution + 2000) : formatCurrency(goal.monthlyContribution)}/mo
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '24px', paddingTop: '8px' }}>
                    <button className="ai-action-btn" style={{ width: '100%', background: 'var(--text-primary)', color: '#000', justifyContent: 'center' }} onClick={() => handleSuccessAction('optimize')}>
                      APPLY AI RECOMMENDATIONS
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'toastDrop 0.5s ease' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <TrendingUp size={32} color="var(--text-positive)" strokeWidth={3} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Optimization Applied!</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Your goals have been adjusted with the new targets.</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

// --- Subcomponents for Modals & Interactivity ---

function CreateEditModal({ isOpen, onClose, goal, onSave }: any) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<Goal>>(goal || {
    name: '',
    category: 'Safety',
    targetAmount: 0,
    currentAmount: 0,
    monthlyContribution: 0,
    targetDate: new Date().toISOString().slice(0, 7),
    priority: 'Medium',
    status: 'ON TRACK'
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return setError('Goal name is required.');
    if (!formData.targetAmount || formData.targetAmount <= 0) return setError('Target amount must be greater than 0.');
    if (formData.currentAmount! > formData.targetAmount) return setError('Current savings cannot exceed target.');
    if (formData.monthlyContribution! < 0) return setError('Contribution cannot be negative.');
    
    setError('');
    onSave(formData);
  };

  return createPortal(
    <div className="goals-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="goals-modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{goal ? 'EDIT GOAL' : 'CREATE A NEW GOAL'}</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="goals-form-group">
            <label className="goals-label">GOAL NAME</label>
            <input className="goals-input" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Emergency Fund" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="goals-form-group">
              <label className="goals-label">CATEGORY</label>
              <select className="goals-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                <option value="Safety">Safety</option>
                <option value="Personal">Personal</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Major Purchase">Major Purchase</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="goals-form-group">
              <label className="goals-label">PRIORITY</label>
              <select className="goals-select" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as any})}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="goals-form-group">
              <label className="goals-label">TARGET AMOUNT (₹)</label>
              <input className="goals-input" type="number" value={formData.targetAmount || ''} onChange={e => setFormData({...formData, targetAmount: Number(e.target.value)})} />
            </div>
            <div className="goals-form-group">
              <label className="goals-label">CURRENT SAVINGS (₹)</label>
              <input className="goals-input" type="number" value={formData.currentAmount || ''} onChange={e => setFormData({...formData, currentAmount: Number(e.target.value)})} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="goals-form-group">
              <label className="goals-label">MONTHLY CONTRIBUTION (₹)</label>
              <input className="goals-input" type="number" value={formData.monthlyContribution || ''} onChange={e => setFormData({...formData, monthlyContribution: Number(e.target.value)})} />
            </div>
            <div className="goals-form-group">
              <label className="goals-label">TARGET DATE</label>
              <input className="goals-input" type="month" value={formData.targetDate} onChange={e => setFormData({...formData, targetDate: e.target.value})} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button type="button" className="goals-secondary-btn" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button type="submit" className="goals-primary-btn" style={{ flex: 1 }}>{goal ? 'SAVE CHANGES' : 'CREATE GOAL'}</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

function ContributionModal({ isOpen, onClose, goal, onSave }: any) {
  if (!isOpen || !goal) return null;
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && amount > 0) {
      onSave(Number(amount));
    }
  };

  return createPortal(
    <div className="goals-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="goals-modal-content" style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>ADD TO GOAL</h2>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{goal.name}</div>
          <div style={{ fontFamily: 'var(--font-primary)', fontSize: '2rem', color: 'var(--accent-gold)' }}>CURRENT: {formatCurrency(goal.currentAmount)}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="goals-form-group">
            <label className="goals-label">CONTRIBUTION AMOUNT (₹)</label>
            <input className="goals-input" type="number" autoFocus value={amount} onChange={e => setAmount(Number(e.target.value) || '')} placeholder="e.g. 5000" />
          </div>
          <button type="submit" className="goals-primary-btn" style={{ width: '100%', marginTop: '16px' }}>ADD CONTRIBUTION</button>
        </form>
      </div>
    </div>,
    document.body
  );
}

function DeleteModal({ isOpen, onClose, goal, onConfirm }: any) {
  if (!isOpen || !goal) return null;
  return createPortal(
    <div className="goals-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="goals-modal-content" style={{ maxWidth: '400px' }}>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', marginBottom: '16px', color: '#ef4444' }}>DELETE GOAL?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Are you sure you want to remove <strong>{goal.name}</strong>? This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="goals-secondary-btn" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
          <button className="goals-primary-btn" style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={onConfirm}>DELETE GOAL</button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function Simulator({ goal }: any) {
  const [simMonthly, setSimMonthly] = useState(goal.monthlyContribution);
  
  const estimatedMonths = calculateMonthsRemaining(goal.currentAmount, goal.targetAmount, simMonthly);
  const estimatedDate = getEstimatedDate(new Date().toISOString(), estimatedMonths);
  const originalMonths = calculateMonthsRemaining(goal.currentAmount, goal.targetAmount, goal.monthlyContribution);
  const monthsSaved = originalMonths !== -1 && estimatedMonths !== -1 ? originalMonths - estimatedMonths : 0;

  return (
    <div className="glass-card" style={{ padding: '24px', background: 'rgba(201, 164, 108, 0.05)', border: '1px solid rgba(201, 164, 108, 0.1)' }}>
      <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '16px' }}>WHAT IF YOU SAVED MORE?</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>See how changing your monthly contribution affects your goal timeline.</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly</span>
        <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--accent-gold)' }}>{formatCurrency(simMonthly)}/mo</span>
      </div>
      
      <input 
        type="range" 
        className="goals-slider" 
        min={0} 
        max={Math.max(50000, goal.monthlyContribution * 3)} 
        step={500} 
        value={simMonthly} 
        onChange={(e) => setSimMonthly(Number(e.target.value))} 
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>NEW COMPLETION</div>
          <div style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-primary)' }}>{estimatedDate}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>MONTHS SAVED</div>
          <div style={{ fontFamily: 'var(--font-primary)', color: monthsSaved > 0 ? 'var(--text-positive)' : 'var(--text-secondary)' }}>
            {monthsSaved > 0 ? `${monthsSaved} months faster` : monthsSaved < 0 ? `${Math.abs(monthsSaved)} months slower` : 'No change'}
          </div>
        </div>
      </div>
    </div>
  );
}
