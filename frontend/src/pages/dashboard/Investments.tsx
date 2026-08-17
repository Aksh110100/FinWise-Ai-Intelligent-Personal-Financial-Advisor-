import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, ArrowRight, X, AlertCircle, CheckCircle, Search, 
  Plus, Target, PieChart as PieChartIcon, ShieldAlert 
} from 'lucide-react';
import { investmentData } from '../../data/investmentData';
import '../../styles/investments.css';

// Custom Tooltip for Line Chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.value >= data.invested;
    const returnValue = data.value - data.invested;
    
    return (
      <div className="inv-custom-tooltip">
        <div className="tooltip-title">{data.month}</div>
        <div className="tooltip-row">
          <span style={{ color: 'var(--text-secondary)' }}>Portfolio</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{data.value.toLocaleString()}</span>
        </div>
        <div className="tooltip-row">
          <span style={{ color: 'var(--text-secondary)' }}>Invested</span>
          <span style={{ color: 'var(--text-primary)' }}>₹{data.invested.toLocaleString()}</span>
        </div>
        <div className="tooltip-row" style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Return</span>
          <span style={{ color: isPositive ? 'var(--text-positive)' : 'var(--accent-coral)', fontWeight: 600 }}>
            {isPositive ? '+' : '-'}₹{Math.abs(returnValue).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};



export default function Investments() {
  const [activeRange, setActiveRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Calculate SVG stroke-dasharray parameters for a 100 radius circle (circumference = ~628.3)
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const allocationSegments = investmentData.allocationData.map((cat) => {
    const strokeDasharray = `${(cat.value / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += (cat.value / 100) * circumference;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const displayAlloc = activeIndex !== null && activeIndex < investmentData.allocationData.length 
    ? investmentData.allocationData[activeIndex] 
    : null;
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [successType, setSuccessType] = useState<string | null>(null);

  // Planner state
  const [plannerMonthly, setPlannerMonthly] = useState(investmentData.plannerDefaults.monthlyInvestment);
  const [plannerReturn, setPlannerReturn] = useState(investmentData.plannerDefaults.expectedReturn);
  const [plannerYears, setPlannerYears] = useState(investmentData.plannerDefaults.timePeriod);

  const projectedValue = useMemo(() => {
    const r = plannerReturn / 100 / 12;
    const n = plannerYears * 12;
    if (r === 0) return plannerMonthly * n;
    return Math.round(plannerMonthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
  }, [plannerMonthly, plannerReturn, plannerYears]);

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

  const currentGraphData = investmentData.performanceData[activeRange];

  return (
    <div className="investments-container">
      <div className="investments-glow-bg"></div>

      {/* Header */}
      <div className="inv-animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: '2.5rem', fontWeight: 300, letterSpacing: '0.05em', margin: '0 0 8px 0' }}>INVESTMENTS</h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              Understand your portfolio, track growth,<br/>and plan where your money goes next.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '4px' }}>PORTFOLIO VALUE</div>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '2rem', color: 'var(--accent-gold)' }}>₹{investmentData.summary.currentValue.toLocaleString()}</div>
            <div style={{ color: 'var(--text-positive)', fontSize: '0.875rem', marginTop: '4px' }}>
              +₹{investmentData.summary.thisMonthReturn.toLocaleString()} (+{investmentData.summary.thisMonthPercentage}% this month)
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="dashboard-quick-btn" onClick={() => setActivePanel('add')}>
            <Plus size={16} />
            <span>ADD INVESTMENT</span>
          </button>
          <button className="dashboard-quick-btn" onClick={() => setActivePanel('plan')}>
            <Target size={16} />
            <span>PLAN INVESTMENT</span>
          </button>
          <button className="dashboard-quick-btn" onClick={() => setActivePanel('review')}>
            <PieChartIcon size={16} />
            <span>REVIEW PORTFOLIO</span>
          </button>
          <button className="dashboard-quick-btn" onClick={() => setActivePanel('set-goal')}>
            <ShieldAlert size={16} />
            <span>SET INVESTMENT GOAL</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="inv-metrics-grid inv-animate-fade-up delay-100">
        <div className="inv-glass-panel interactive">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>TOTAL INVESTED</div>
          <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem' }}>₹{investmentData.summary.totalInvested.toLocaleString()}</div>
        </div>
        <div className="inv-glass-panel interactive">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>CURRENT VALUE</div>
          <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>₹{investmentData.summary.currentValue.toLocaleString()}</div>
        </div>
        <div className="inv-glass-panel interactive">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>TOTAL RETURNS</div>
          <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-positive)' }}>+₹{investmentData.summary.totalReturns.toLocaleString()}</div>
        </div>
        <div className="inv-glass-panel interactive">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginBottom: '8px' }}>RETURN</div>
          <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-positive)' }}>+{investmentData.summary.returnPercentage}%</div>
        </div>
      </div>

      {/* Portfolio Overview & Allocation */}
      <div className="inv-overview-grid inv-animate-fade-up delay-200">
        <div className="inv-glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', margin: '0 0 4px 0', letterSpacing: '0.05em' }}>PORTFOLIO PERFORMANCE</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>Growth of your invested capital</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  style={{
                    background: activeRange === range ? 'rgba(201, 164, 108, 0.1)' : 'transparent',
                    color: activeRange === range ? 'var(--accent-gold)' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: activeRange === range ? 'rgba(201, 164, 108, 0.3)' : 'transparent',
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-secondary)'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentGraphData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                  dy={10} 
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--accent-gold)" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: 'var(--accent-gold)', stroke: 'rgba(201, 164, 108, 0.3)', strokeWidth: 4 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="inv-glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', margin: '0 0 24px 0', letterSpacing: '0.05em' }}>PORTFOLIO ALLOCATION</h2>
          <div className="donut-container">
            <div className="donut-chart-wrapper">
              <svg viewBox="0 0 240 240" className="donut-svg">
                <circle 
                  cx="120" cy="120" r={radius} 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="20" 
                />
                
                {allocationSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx="120" cy="120" r={radius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={activeIndex === idx ? "24" : "20"}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    className="donut-segment svg-draw-circle"
                    style={{ 
                      transition: 'stroke-width 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                ))}
              </svg>

              <div className="donut-center-text">
                <span className="donut-amount">
                  {displayAlloc ? `₹${displayAlloc.amount.toLocaleString()}` : `₹${investmentData.summary.currentValue.toLocaleString()}`}
                </span>
                <span className="donut-label">
                  {displayAlloc ? displayAlloc.name : 'TOTAL PORTFOLIO'}
                </span>
              </div>
            </div>

            <div className="donut-legend">
              {allocationSegments.map((seg, idx) => (
                <div 
                  key={idx} 
                  className={`legend-item ${activeIndex === idx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <div className="legend-color" style={{ backgroundColor: seg.color }}></div>
                  <span className="legend-name">{seg.name}</span>
                  <span className="legend-pct">{seg.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Returns & Breakdown */}
      <div className="inv-breakdown-grid inv-animate-fade-up delay-300">
        <div className="inv-glass-panel">
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>RETURNS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>TOTAL RETURNS</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-positive)', fontSize: '1.125rem' }}>+₹{investmentData.returnsData.total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>TODAY</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-positive)', fontSize: '1.125rem' }}>+₹{investmentData.returnsData.today.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>THIS MONTH</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-positive)', fontSize: '1.125rem' }}>+₹{investmentData.returnsData.thisMonth.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>THIS YEAR</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--text-positive)', fontSize: '1.125rem' }}>+₹{investmentData.returnsData.thisYear.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="inv-glass-panel">
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>WHERE YOUR MONEY IS INVESTED</h3>
          <div className="inv-breakdown-bar-container">
            {investmentData.allocationData.map((item, idx) => (
              <div key={idx} className="inv-bar-row">
                <div className="inv-bar-header">
                  <span style={{ fontSize: '0.875rem' }}>{item.name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-primary)' }}>₹{item.amount.toLocaleString()}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.value}%</div>
                  </div>
                </div>
                <div className="inv-bar-track">
                  <div className="inv-bar-fill" style={{ width: `${item.value}%`, background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Investments */}
      <div className="inv-glass-panel inv-animate-fade-up delay-400" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>YOUR INVESTMENTS</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {investmentData.investmentList.map((inv, idx) => (
            <div key={idx} className="inv-list-row">
              <div className="inv-list-col">
                <div style={{ fontWeight: 500 }}>{inv.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{inv.category}</div>
              </div>
              <div className="inv-list-col" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.125rem' }}>₹{inv.value.toLocaleString()}</div>
              </div>
              <div className="inv-list-col" style={{ textAlign: 'center', color: 'var(--text-positive)' }}>
                +{inv.returnPct}%
              </div>
              <div className="inv-list-col" style={{ height: '30px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={inv.history.map((v, i) => ({ value: v, index: i }))}>
                    <Line type="monotone" dataKey="value" stroke="var(--text-positive)" strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Connection & AI Insight */}
      <div className="inv-breakdown-grid inv-animate-fade-up delay-500">
        <div className="inv-glass-panel">
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>YOUR MONEY → YOUR GOALS</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {investmentData.goals.map((goal, idx) => (
              <div key={idx} className="inv-goal-row interactive" onClick={() => setActivePanel(`goal-${idx}`)}>
                <div className="inv-goal-header">
                  <span>{goal.name}</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{goal.percentage}%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                </div>
                <div className="inv-goal-track">
                  <div className="inv-goal-fill" style={{ width: `${goal.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="inv-glass-panel" style={{ border: '1px solid rgba(201, 164, 108, 0.3)' }}>
            <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--accent-gold)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={14} />
              {investmentData.aiInsight.title}
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '24px' }}>
              {investmentData.aiInsight.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CURRENT EQUITY</div>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{investmentData.aiInsight.currentEquity}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SUGGESTED RANGE</div>
                <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', color: 'var(--accent-gold)' }}>{investmentData.aiInsight.suggestedRange}</div>
              </div>
            </div>
            <button 
              className="ai-action-btn" 
              style={{ width: '100%', justifyContent: 'space-between' }}
              onClick={() => setActivePanel('review')}
            >
              REVIEW PORTFOLIO
              <ArrowRight size={16} />
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
              AI INSIGHT — DEMO
            </div>
          </div>

          <div className="inv-glass-panel">
            <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '16px' }}>YOUR INVESTMENT PROFILE</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <div style={{ height: '4px', flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
                <div style={{ height: '4px', flex: 1, background: 'var(--accent-gold)', borderRadius: '2px', boxShadow: '0 0 8px rgba(201,164,108,0.5)' }}></div>
                <div style={{ height: '4px', flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div>
              </div>
              <div style={{ fontFamily: 'var(--font-primary)', color: 'var(--accent-gold)' }}>{investmentData.riskProfile.level}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              RISK LEVEL: {investmentData.riskProfile.score} / 10
            </div>
          </div>
        </div>
      </div>

      {/* Planner & Watchlist */}
      <div className="inv-breakdown-grid inv-animate-fade-up delay-500">
        <div className="inv-glass-panel">
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '32px' }}>PLAN YOUR NEXT INVESTMENT</h3>
          
          <div className="inv-planner-row">
            <div className="inv-planner-header">
              <span>MONTHLY INVESTMENT</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--accent-gold)' }}>₹{plannerMonthly.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="0" max="50000" step="1000" 
              value={plannerMonthly} 
              onChange={(e) => setPlannerMonthly(Number(e.target.value))}
              className="inv-slider"
            />
          </div>

          <div className="inv-planner-row">
            <div className="inv-planner-header">
              <span>EXPECTED RETURN</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--accent-gold)' }}>{plannerReturn}%</span>
            </div>
            <input 
              type="range" 
              min="1" max="25" step="0.5" 
              value={plannerReturn} 
              onChange={(e) => setPlannerReturn(Number(e.target.value))}
              className="inv-slider"
            />
          </div>

          <div className="inv-planner-row">
            <div className="inv-planner-header">
              <span>TIME PERIOD</span>
              <span style={{ fontFamily: 'var(--font-primary)', color: 'var(--accent-gold)' }}>{plannerYears} YEARS</span>
            </div>
            <input 
              type="range" 
              min="1" max="30" step="1" 
              value={plannerYears} 
              onChange={(e) => setPlannerYears(Number(e.target.value))}
              className="inv-slider"
            />
          </div>

          <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>PROJECTED VALUE</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-positive)' }}>
              ₹{projectedValue.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="inv-glass-panel">
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>FINWISE WATCHLIST</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {investmentData.watchlist.map((item, idx) => (
              <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.value}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ fontSize: '0.65rem', padding: '4px 8px', background: 'rgba(201, 164, 108, 0.1)', color: 'var(--accent-gold)', borderRadius: '4px', letterSpacing: '0.05em' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
            DEMO DATA ONLY
          </div>
        </div>
      </div>

      {/* Modals */}
      {activePanel && createPortal(
        <div className={`qa-overlay center ${isClosing ? 'closing' : 'opening'}`} onClick={closePanel}>
          <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
            <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
            <div className="qa-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {!successType ? (
                <>
                  <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '40px', textTransform: 'uppercase' }}>
                    {activePanel === 'add' ? 'ADD INVESTMENT' :
                     activePanel === 'plan' ? 'PLAN INVESTMENT' :
                     activePanel === 'review' ? 'PORTFOLIO REVIEW' :
                     activePanel === 'set-goal' ? 'SET GOAL' : 'DETAILS'}
                  </h2>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      This is a frontend demonstration of the FinWise {activePanel} feature. In a fully implemented version, this would connect to your brokerage accounts or allow manual entry of assets.
                    </p>
                  </div>
                  <button className="ai-action-btn" style={{ marginTop: '40px', background: 'var(--text-primary)', color: '#000', justifyContent: 'center' }} onClick={() => handleSuccessAction(activePanel)}>
                    CONFIRM
                  </button>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'toastDrop 0.5s ease' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <CheckCircle size={32} color="var(--text-positive)" strokeWidth={3} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Action Successful!</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Your request was processed successfully.</p>
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
