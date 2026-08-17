import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

interface AIInsightData {
  type: string;
  title: string;
  message: string;
  detail: string;
  monthlySaving: number;
  yearlySaving: number;
  action: string;
}

const mockInsights: AIInsightData[] = [
  {
    type: "spending",
    title: "Dining spending increased",
    message: "You spent ₹2,400 more on dining this month.",
    detail: "Dining expenses are 18% above your monthly average.",
    monthlySaving: 2400,
    yearlySaving: 28800,
    action: "OPTIMIZE SPENDING"
  },
  {
    type: "subscription",
    title: "Unused subscriptions detected",
    message: "You have 3 subscriptions you rarely use.",
    detail: "Canceling them could improve your monthly savings rate.",
    monthlySaving: 1200,
    yearlySaving: 14400,
    action: "REVIEW SUBSCRIPTIONS"
  },
  {
    type: "saving",
    title: "Your savings rate improved",
    message: "You saved 8% more than last month.",
    detail: "You're moving closer to your emergency fund goal.",
    monthlySaving: 3200,
    yearlySaving: 38400,
    action: "VIEW SAVINGS"
  }
];

interface CountUpProps {
  value: number;
  duration?: number;
  onComplete?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({ value, duration = 1000, onComplete }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration, onComplete]);

  return <span>₹{count.toLocaleString('en-IN')}</span>;
};

interface AIInsightCardProps {
  onActionClick: (insightType: string) => void;
  onDeclineClick?: () => void;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ onActionClick, onDeclineClick }) => {
  const [insights, setInsights] = useState(mockInsights);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMonthStr, setShowMonthStr] = useState(false);
  const [showYearlyStr, setShowYearlyStr] = useState(false);
  const [showActions, setShowActions] = useState(false);

  // Safety fallback to prevent crashes during asynchronous state updates
  const validIndex = currentIndex >= insights.length ? 0 : currentIndex;
  const insight = insights[validIndex];

  useEffect(() => {
    if (isPaused || insights.length === 0) return;

    const timer = setInterval(() => {
      handleNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, insights.length]);

  // Reset animations when index changes
  useEffect(() => {
    setShowMonthStr(false);
    setShowYearlyStr(false);
    setShowActions(false);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => insights.length > 0 ? (prev + 1) % insights.length : 0);
      setIsTransitioning(false);
    }, 450); // wait for fade out
  };

  const removeCurrentInsight = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setInsights(prev => {
        const next = [...prev];
        next.splice(currentIndex, 1);
        return next;
      });
      // Adjust currentIndex if it's now out of bounds
      setCurrentIndex(prev => prev >= insights.length - 1 ? 0 : prev);
      setIsTransitioning(false);
    }, 450);
  };

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 450);
  };

  if (insights.length === 0) {
    return (
      <div className="glass-card ai-insight-card anim-stagger-entry delay-9" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100%', minHeight: '320px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <Sparkles size={32} color="rgba(255,255,255,0.2)" />
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>You're all caught up!</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Check back later for new insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card ai-insight-card anim-stagger-entry delay-9"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="ai-card-glow-moving"></div>

      <div className="ai-header ai-stagger-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Sparkles size={16} color="var(--accent-gold)" className="ai-sparkle-pulse" />
              <span className="ai-title" style={{ marginBottom: 0 }}>FINWISE AI NOTICED</span>
            </div>
            
            <div className="ai-pagination">
              {insights.map((_, idx) => (
                <div 
                  key={idx} 
                  className="ai-dot-wrapper"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDotClick(idx);
                  }}
                >
                  <span className={`ai-dot ${idx === currentIndex ? 'active' : ''}`} />
                </div>
              ))}
            </div>
          </div>

          <div className={`ai-content-wrapper ${isTransitioning ? 'transitioning-out' : 'transitioning-in'}`}>
            <div className="ai-body ai-stagger-2">
              <h4 className="ai-insight-title">"{insight.message}"</h4>
              <p className="ai-detail">{insight.detail}</p>
              
              <div className="ai-impact ai-stagger-3">
                <span className="impact-label">POTENTIAL SAVING</span>
                <div className="impact-value-large">
                  <CountUp 
                    value={insight.monthlySaving} 
                    onComplete={() => {
                      setShowMonthStr(true);
                      setTimeout(() => setShowYearlyStr(true), 300);
                    }} 
                  />
                  <span className="impact-month-suffix" style={{ opacity: showMonthStr ? 1 : 0, transition: 'opacity 0.3s' }}>
                     {' '}/ MONTH
                  </span>
                </div>
                <div className="impact-yearly" style={{ opacity: showYearlyStr ? 1 : 0, transition: 'opacity 0.4s' }}>
                  ₹{insight.yearlySaving.toLocaleString('en-IN')} / YEAR
                </div>
              </div>
            </div>

            <div className="ai-footer ai-stagger-4" style={{ marginTop: 'auto', display: 'flex', width: '100%' }}>
              {!showActions ? (
                <button 
                  className="ai-action-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(true);
                  }}
                >
                  {insight.action} <ArrowRight size={16} />
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                  <button 
                    className="ai-action-btn" 
                    style={{ flex: 1, backgroundColor: 'rgba(255, 0, 0, 0.05)', borderColor: 'rgba(255, 0, 0, 0.2)', color: 'var(--text-negative)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(false);
                      if (onDeclineClick) onDeclineClick();
                      removeCurrentInsight();
                    }}
                  >
                    DECLINE
                  </button>
                  <button 
                    className="ai-action-btn" 
                    style={{ flex: 1, backgroundColor: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: '#000' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(false);
                      onActionClick(insight.type);
                      removeCurrentInsight();
                    }}
                  >
                    APPLY <ArrowRight size={16} color="#000" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
  );
};
