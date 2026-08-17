import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { savingsData } from '../../data/savingsData';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar } from 'recharts';
import { ArrowRight, X, PiggyBank, Target, TrendingUp, FileText, ChevronRight, Check } from 'lucide-react';
import '../../styles/savings.css';

// Animated Number Component
const AnimatedNumber = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
  const [current, setCurrent] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 1500;
          const incrementTime = 30;
          const steps = duration / incrementTime;
          const increment = end / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCurrent(end);
              clearInterval(timer);
            } else {
              setCurrent(start);
            }
          }, incrementTime);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={nodeRef}>
      {prefix}{Math.floor(current).toLocaleString('en-IN')}{suffix}
    </span>
  );
};

// Custom Tooltip for Main Graph
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="savings-custom-tooltip">
        <div className="tooltip-label">{label}</div>
        <div className="tooltip-row">
          <div className="dot income-dot"></div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Saved</span>
          <span className="tooltip-val" style={{ color: 'var(--text-primary)' }}>₹{payload[0].value.toLocaleString('en-IN')}</span>
        </div>
        {payload[0].payload.rate && (
          <div className="tooltip-row">
             <div className="dot" style={{background: 'var(--text-secondary)'}}></div>
             <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Rate</span>
             <span className="tooltip-val" style={{ color: 'var(--text-secondary)' }}>{payload[0].payload.rate}%</span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const Savings: React.FC = () => {
  const [activeRange, setActiveRange] = useState('1Y');
  const [activePanel, setActivePanel] = useState<string | null>(null);
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
  
  // Simulator state
  const [simulatorValue, setSimulatorValue] = useState(5000);
  const baseGoalMonths = 19;
  const currentGoalMonths = Math.max(1, baseGoalMonths - Math.floor(simulatorValue / 1000));
  const monthsSaved = baseGoalMonths - currentGoalMonths;

  const currentGraphData = savingsData.growthData[activeRange as keyof typeof savingsData.growthData] || savingsData.growthData['1Y'];

  return (
    <div className="savings-dashboard-wrapper">
      {/* Subtle Background Glow */}
      <div className="savings-dashboard-glow"></div>

      <div className="dashboard-content-grid" style={{ zIndex: 1, position: 'relative' }}>
        
        {/* 1. PAGE HEADER */}
        <header className="dashboard-header anim-fade-up delay-1" style={{ flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
            <div>
              <h1 className="header-title">SAVINGS</h1>
              <p className="header-subtext" style={{letterSpacing: '0.05em'}}>Track your savings, understand your progress, and see where your money could take you.</p>
            </div>
            <div className="header-date">
              <span className="date-badge" style={{color: 'var(--text-positive)', background: 'rgba(46, 204, 113, 0.1)'}}>THIS MONTH</span>
              <span className="date-month" style={{color: 'var(--text-primary)', fontSize: '1.25rem'}}>+₹30,800</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="dashboard-quick-btn" onClick={() => setActivePanel('add-saving')}>
              <PiggyBank size={16} />
              <span>ADD SAVING</span>
            </button>
            <button className="dashboard-quick-btn" onClick={() => setActivePanel('set-goal')}>
              <Target size={16} />
              <span>SET SAVINGS GOAL</span>
            </button>
            <button className="dashboard-quick-btn" onClick={() => setActivePanel('optimize')}>
              <TrendingUp size={16} />
              <span>OPTIMIZE SAVINGS</span>
            </button>
            <button className="dashboard-quick-btn" onClick={() => setActivePanel('view-report')}>
              <FileText size={16} />
              <span>VIEW REPORT</span>
            </button>
          </div>
        </header>
        
        <div className="sidebar-divider" style={{margin: '0 0 8px 0'}}></div>

        {/* 2. TOP SUMMARY */}
        <div className="kpi-grid anim-fade-up delay-2">
          <div className="glass-card kpi-card savings-metric-card">
            <div className="kpi-title">TOTAL SAVED</div>
            <div className="kpi-value"><AnimatedNumber value={savingsData.summary.totalSavedThisMonth} prefix="₹" /></div>
          </div>
          <div className="glass-card kpi-card savings-metric-card">
            <div className="kpi-title">SAVINGS RATE</div>
            <div className="kpi-value"><AnimatedNumber value={savingsData.summary.savingsRate} suffix="%" /></div>
          </div>
          <div className="glass-card kpi-card savings-metric-card">
            <div className="kpi-title">MONTHLY CHANGE</div>
            <div className="kpi-value" style={{color: 'var(--text-positive)'}}>+{savingsData.summary.monthlyChange}%</div>
          </div>
          <div className="glass-card kpi-card savings-metric-card">
            <div className="kpi-title">PROJECTED YEAR</div>
            <div className="kpi-value" style={{color: 'var(--accent-gold)'}}>₹1,72,000</div>
          </div>
        </div>

        {/* 3. MAIN CONTENT LAYOUT (70/30) */}
        <div className="dashboard-row-2 anim-fade-up delay-3">
          
          {/* LEFT: SAVINGS GROWTH */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="graph-header" style={{ marginBottom: '16px' }}>
              <div>
                <div className="card-title" style={{marginBottom: '4px'}}>SAVINGS GROWTH</div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Cumulative savings over time</div>
              </div>
              <div className="timeframe-controls">
                {['7D', '1M', '3M', '6M', '1Y'].map(range => (
                  <button 
                    key={range}
                    className={`tf-btn ${activeRange === range ? 'active' : ''}`}
                    onClick={() => setActiveRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="graph-container" style={{ flex: 1, minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentGraphData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
                  <RechartsTooltip 
                    content={<CustomTooltip />} 
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} 
                    animationDuration={250}
                    animationEasing="ease-out"
                    isAnimationActive={true}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="saved" 
                    stroke="var(--accent-gold)" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 5, fill: 'var(--accent-gold)', stroke: '#000', strokeWidth: 2 }} 
                    animationDuration={1500}
                    style={{ filter: 'drop-shadow(0 4px 6px rgba(201, 164, 108, 0.3))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT: HEALTH & FORECAST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Health */}
            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="card-title" style={{ alignSelf: 'flex-start' }}>SAVINGS HEALTH</div>
              <div className="health-ring-container" style={{ width: '120px', height: '120px', marginBottom: '16px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-gold)" strokeWidth="8" strokeDasharray="283" strokeDashoffset="283" style={{ animation: 'dash 1.5s ease-out forwards' }} />
                </svg>
                <div className="health-score-text">
                  <div className="health-num" style={{fontSize: '2rem'}}>36<span style={{fontSize:'1rem'}}>.2%</span></div>
                  <div style={{fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '0.1em', marginTop: '2px'}}>RATE</div>
                </div>
              </div>
              <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 16px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{color: 'var(--text-secondary)'}}>TARGET</span>
                  <span style={{fontWeight: 600}}>40%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                  <span style={{color: 'var(--text-secondary)'}}>STATUS</span>
                  <span style={{color: 'var(--text-positive)', fontWeight: 600}}>ON TRACK</span>
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="glass-card" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div className="card-title" style={{marginBottom: 0}}>SAVINGS FORECAST</div>
                <div className="date-badge" style={{background: 'rgba(201, 164, 108, 0.1)', color: 'var(--accent-gold)'}}>AI DEMO</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                <span>CURRENT: <strong style={{color: 'var(--text-primary)'}}>₹86K</strong></span>
                <span>12 MO: <strong style={{color: 'var(--accent-gold)'}}>₹172K</strong></span>
              </div>
              
              <div style={{ height: '80px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={savingsData.forecast.historical.concat(savingsData.forecast.future.slice(1, 13))} margin={{top:5, right:0, left:0, bottom:0}}>
                     <defs>
                      <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-gold)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent-gold)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="projected" stroke="var(--accent-gold)" strokeDasharray="3 3" fillOpacity={1} fill="url(#colorForecast)" />
                    <Area type="monotone" dataKey="current" stroke="var(--text-primary)" fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BREAKDOWN & GOALS (50/50) */}
        <div className="dashboard-row-bottom anim-fade-up delay-4" style={{gridTemplateColumns: '1fr 1fr'}}>
          
          {/* Breakdown */}
          <div className="glass-card">
            <div className="card-title">WHERE YOUR SAVINGS CAME FROM</div>
            <div className="breakdown-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
              {savingsData.breakdown.map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '140px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{b.label}</div>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative' }}>
                    <div className="anim-width" style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'var(--text-positive)', width: `${(b.impact/5000)*100}%`, borderRadius: '2px' }}></div>
                  </div>
                  <div style={{ width: '60px', textAlign: 'right', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    +₹{b.impact.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="glass-card">
            <div className="card-title">SAVINGS GOALS</div>
            <div className="goals-list" style={{ marginTop: '24px', gap: '20px' }}>
              {savingsData.goals.map(g => {
                const pct = Math.round((g.current / g.target) * 100);
                return (
                  <div key={g.id} className="goal-item-compact" onClick={() => setActivePanel('goal-' + g.id)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{g.title}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '8px', position: 'relative' }}>
                      <div className="anim-width" style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'var(--accent-gold)', width: `${pct}%`, borderRadius: '2px' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>₹{g.current.toLocaleString('en-IN')} / ₹{g.target.toLocaleString('en-IN')}</span>
                      <span>{g.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. SIMULATOR & AI INSIGHT */}
        <div className="dashboard-row-2 anim-fade-up delay-5" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          
          <div className="glass-card">
            <div className="card-title">WHAT IF YOU SAVED MORE?</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>Small changes today can move your goals closer.</p>
            
            <div style={{ padding: '0 16px', marginBottom: '32px' }}>
              <input 
                type="range" 
                className="savings-simulator-slider"
                min="0" 
                max="10000" 
                step="500" 
                value={simulatorValue} 
                onChange={(e) => setSimulatorValue(parseInt(e.target.value))}
              />
              <div style={{ textAlign: 'center', fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--accent-gold)', marginTop: '16px' }}>
                ₹{simulatorValue.toLocaleString('en-IN')} extra / month
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>TIME TO GOAL</span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-primary)', color: 'var(--text-primary)' }}>{currentGoalMonths} MO</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>EXTRA YEARLY SAVING</span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-primary)', color: 'var(--accent-gold)' }}>₹{(simulatorValue * 12).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>TIME SAVED</span>
                <span style={{ fontSize: '1.25rem', fontFamily: 'var(--font-primary)', color: 'var(--text-positive)' }}>{monthsSaved} MO</span>
              </div>
            </div>
          </div>

          <div className="glass-card ai-insight-card">
             <div className="ai-header">
                <div className="ai-title">✦ FINWISE AI NOTICED</div>
              </div>
              <div className="ai-statement" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>
                "You're consistently saving more than last month. Increasing your monthly savings by ₹2,000 could bring your emergency fund goal closer sooner."
              </div>
              <div className="ai-impact">
                <span className="impact-label">POTENTIAL IMPACT</span>
                <span className="impact-value">+₹24,000 / YEAR</span>
              </div>
              <button className="ai-action-btn" onClick={() => setActivePanel('optimize')}>
                OPTIMIZE SAVINGS <ArrowRight size={14} />
              </button>
          </div>
        </div>

        {/* 6. ANALYTICS (Small row) */}
        <div className="glass-card anim-fade-up delay-6" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div className="card-title" style={{marginBottom: 0}}>SAVINGS ANALYTICS</div>
            <div className="date-badge">POWER BI READY</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '16px', height: '120px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Savings Rate</span>
              <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', paddingTop: '16px' }}>
                {[30, 32, 31, 33, 34, 35, 36.2].map((v, i) => (
                  <div key={i} style={{ flex: 1, background: i === 6 ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', height: `${(v/40)*100}%`, borderRadius: '2px' }}></div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '16px', height: '120px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Monthly Savings</span>
              <div style={{ flex: 1, marginTop: '8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData.forecast.historical.slice(-6)} margin={{top:10, right:0, left:0, bottom:0}}>
                    <Bar dataKey="current" fill="rgba(255,255,255,0.2)" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '8px', padding: '16px', height: '120px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cumulative Savings</span>
              <div style={{ flex: 1, marginTop: '8px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={savingsData.growthData['6M']} margin={{top:10, right:0, left:0, bottom:0}}>
                    <Line type="monotone" dataKey="saved" stroke="var(--text-positive)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modals */}
      {activePanel && createPortal(
        <div className={`qa-overlay center ${isClosing ? 'closing' : 'opening'}`} onClick={closePanel}>
          {activePanel === 'optimize' && (
            <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
              <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
              <div className="qa-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {successType !== 'optimize' ? (
                  <>
                    <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '40px', textTransform: 'uppercase' }}>OPTIMIZE YOUR SAVINGS</h2>
            
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>CURRENT MONTHLY SAVINGS</div>
                        <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem' }}>₹30,800</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>SUGGESTED TARGET</div>
                        <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>₹35,000</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>POTENTIAL YEARLY DIFFERENCE</div>
                        <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--text-positive)' }}>+₹50,400</div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>RECOMMENDATIONS</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem' }}>Reduce dining</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.875rem' }}>+₹2,400</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem' }}>Reduce subscriptions</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.875rem' }}>+₹768</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem' }}>Increase auto-savings</span>
                        <span style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.875rem' }}>+₹2,000</span>
                      </div>
                    </div>

                    <button className="ai-action-btn" style={{ marginTop: 'auto', background: 'var(--text-primary)', color: '#000', justifyContent: 'center' }} onClick={() => handleSuccessAction('optimize')}>
                      APPLY PLAN
                    </button>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'toastDrop 0.5s ease' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      <TrendingUp size={32} color="var(--text-positive)" strokeWidth={3} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Optimization Applied!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your budget has been adjusted with the new savings target.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePanel?.startsWith('goal-') && (
            <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
              <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
              <div className="qa-panel-content">
                <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '40px', textTransform: 'uppercase' }}>GOAL DETAILS</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>CURRENT PROGRESS</div>
                    <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem' }}>₹72,000 / ₹1,50,000</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>REMAINING</div>
                    <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>₹78,000</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>MONTHLY TARGET</div>
                    <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>₹12,000</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>ESTIMATED COMPLETION</div>
                    <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', color: 'var(--text-positive)' }}>DEC 2026</div>
                  </div>
                </div>

                <button className="ai-action-btn" style={{ marginTop: '16px', justifyContent: 'center' }} onClick={closePanel}>
                  ADJUST GOAL
                </button>
              </div>
            </div>
          )}

          {activePanel === 'add-saving' && (
            <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
              <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
              <div className="qa-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {successType !== 'saving' ? (
                  <>
                    <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '40px', textTransform: 'uppercase' }}>RECORD NEW SAVING</h2>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>AMOUNT</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0', top: '2px', color: 'var(--text-muted)', fontSize: '1.5rem', fontFamily: 'var(--font-primary)' }}>₹</span>
                        <input type="text" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '1.5rem', fontFamily: 'var(--font-primary)', padding: '4px 0 4px 32px', outline: 'none' }} placeholder="0.00" />
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>SOURCE / NOTE</label>
                      <input type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', padding: '12px', fontSize: '0.9rem', outline: 'none' }} placeholder="e.g. Salary, Bonus, Reduced Expenses" />
                    </div>

                    <button className="ai-action-btn" style={{ marginTop: 'auto', background: 'var(--text-primary)', color: '#000', justifyContent: 'center' }} onClick={() => handleSuccessAction('saving')}>
                      CONFIRM SAVING
                    </button>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'toastDrop 0.5s ease' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      <Check size={32} color="var(--text-positive)" strokeWidth={3} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Saving Recorded!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your saving has been successfully processed.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePanel === 'set-goal' && (
            <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
              <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
              <div className="qa-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {successType !== 'goal' ? (
                  <>
                    <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '40px', textTransform: 'uppercase' }}>NEW SAVINGS GOAL</h2>
                    
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>GOAL NAME</label>
                      <input type="text" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-primary)', padding: '12px', fontSize: '0.9rem', outline: 'none' }} placeholder="e.g. New Car, Vacation" />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '12px' }}>TARGET AMOUNT</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0', top: '2px', color: 'var(--text-muted)', fontSize: '1.5rem', fontFamily: 'var(--font-primary)' }}>₹</span>
                        <input type="text" style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '1.5rem', fontFamily: 'var(--font-primary)', padding: '4px 0 4px 32px', outline: 'none' }} placeholder="0.00" />
                      </div>
                    </div>

                    <button className="ai-action-btn" style={{ marginTop: 'auto', background: 'var(--accent-gold)', color: '#000', justifyContent: 'center' }} onClick={() => handleSuccessAction('goal')}>
                      CREATE GOAL
                    </button>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'toastDrop 0.5s ease' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201, 164, 108, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      <Target size={32} color="var(--accent-gold)" strokeWidth={2} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Goal Created!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your new savings goal has been set up successfully.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePanel === 'view-report' && (
            <div className={`qa-panel floating ${isClosing ? 'closing' : 'opening'}`} onClick={(e) => e.stopPropagation()} style={{ width: '450px', maxWidth: '90vw' }}>
              <button className="qa-close-btn" onClick={closePanel}><X size={24} /></button>
              <div className="qa-panel-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {successType !== 'report' ? (
                  <>
                    <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '40px', textTransform: 'uppercase' }}>MONTHLY REPORT</h2>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                      <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                         <FileText size={48} color="var(--accent-gold)" style={{ opacity: 0.8, marginBottom: '16px' }} />
                         <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-primary)' }}>August 2026 Report Ready</h3>
                         <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>Your comprehensive savings and optimization report has been generated and is ready to download.</p>
                      </div>
                    </div>

                    <button className="ai-action-btn" style={{ marginTop: 'auto', background: 'var(--text-primary)', color: '#000', justifyContent: 'center' }} onClick={() => handleSuccessAction('report')}>
                      DOWNLOAD PDF
                    </button>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', animation: 'toastDrop 0.5s ease' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                      <Check size={32} color="var(--text-positive)" strokeWidth={3} />
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.5rem', marginBottom: '8px' }}>Downloaded!</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Your PDF report is downloading to your device.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

    </div>
  );
};

export default Savings;
