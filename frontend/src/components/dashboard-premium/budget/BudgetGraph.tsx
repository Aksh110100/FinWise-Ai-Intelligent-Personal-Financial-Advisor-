import React, { useRef, useState, useEffect } from 'react';
import { Budget } from '../../../data/mockBudgetData';

const SVG_WIDTH = 800;
const SVG_HEIGHT = 220;

const MONTHS_DATA = [
  { month: 'MAY', budget: 60000, actual: 48200 },
  { month: 'JUN', budget: 60000, actual: 51400 },
  { month: 'JUL', budget: 60000, actual: 55200 },
  { month: 'AUG', budget: 60000, actual: 42800 },
];

interface BudgetGraphProps {
  currentTotalBudget: number;
  currentTotalSpent: number;
}

export const BudgetGraph: React.FC<BudgetGraphProps> = ({ currentTotalBudget, currentTotalSpent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathBudgetRef = useRef<SVGPathElement>(null);
  const pathActualRef = useRef<SVGPathElement>(null);
  const [trackerState, setTrackerState] = useState<{ 
    svgX: number; 
    budgetY: number; 
    actualY: number; 
    budgetVal: number;
    actualVal: number;
    dataIndex: number; 
  } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [...MONTHS_DATA];
  if (currentTotalBudget > 0 || currentTotalSpent > 0) {
    data[3] = { month: 'AUG', budget: currentTotalBudget || 60000, actual: currentTotalSpent };
  }

  const maxVal = Math.max(...data.map(d => Math.max(d.budget, d.actual))) * 1.2;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (SVG_WIDTH - 60) + 30; // padding
    const yBudget = SVG_HEIGHT - (d.budget / maxVal) * SVG_HEIGHT;
    const yActual = SVG_HEIGHT - (d.actual / maxVal) * SVG_HEIGHT;
    return { x, yBudget, yActual, ...d };
  });

  const pathBudget = `M ${points[0].x},${points[0].yBudget} ` + points.map((p, i) => {
    if (i === 0) return '';
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `C ${cpX},${prev.yBudget} ${cpX},${p.yBudget} ${p.x},${p.yBudget}`;
  }).join(' ');

  const initialPathBudget = `M ${points[0].x},${SVG_HEIGHT} ` + points.map((p, i) => {
    if (i === 0) return '';
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `C ${cpX},${SVG_HEIGHT} ${cpX},${SVG_HEIGHT} ${p.x},${SVG_HEIGHT}`;
  }).join(' ');

  const pathActual = `M ${points[0].x},${points[0].yActual} ` + points.map((p, i) => {
    if (i === 0) return '';
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `C ${cpX},${prev.yActual} ${cpX},${p.yActual} ${p.x},${p.yActual}`;
  }).join(' ');

  const initialPathActual = `M ${points[0].x},${SVG_HEIGHT} ` + points.map((p, i) => {
    if (i === 0) return '';
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `C ${cpX},${SVG_HEIGHT} ${cpX},${SVG_HEIGHT} ${p.x},${SVG_HEIGHT}`;
  }).join(' ');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !pathBudgetRef.current || !pathActualRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    const svgX = ratio * SVG_WIDTH;

    // Bounds check to avoid searching outside path
    if (svgX < points[0].x || svgX > points[points.length-1].x) {
      setTrackerState(null);
      return;
    }

    // Binary search for Budget Path
    let minL = 0, maxL = pathBudgetRef.current.getTotalLength(), targetL = maxL / 2;
    let pointBudget = pathBudgetRef.current.getPointAtLength(targetL);
    for (let i = 0; i < 12; i++) {
      if (pointBudget.x < svgX) minL = targetL; else maxL = targetL;
      targetL = (minL + maxL) / 2;
      pointBudget = pathBudgetRef.current.getPointAtLength(targetL);
    }

    // Binary search for Actual Path
    minL = 0; maxL = pathActualRef.current.getTotalLength(); targetL = maxL / 2;
    let pointActual = pathActualRef.current.getPointAtLength(targetL);
    for (let i = 0; i < 12; i++) {
      if (pointActual.x < svgX) minL = targetL; else maxL = targetL;
      targetL = (minL + maxL) / 2;
      pointActual = pathActualRef.current.getPointAtLength(targetL);
    }
    
    // Find closest index for month text display
    let closestIndex = 0;
    let minDiff = Infinity;
    points.forEach((p, i) => {
      const diff = Math.abs(p.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    const budgetVal = Math.round(maxVal - (pointBudget.y / SVG_HEIGHT) * maxVal);
    const actualVal = Math.round(maxVal - (pointActual.y / SVG_HEIGHT) * maxVal);

    setTrackerState({ 
      svgX, 
      budgetY: pointBudget.y, 
      actualY: pointActual.y, 
      budgetVal, 
      actualVal, 
      dataIndex: closestIndex 
    });
  };

  return (
    <div className="budget-glass-panel">
      <h3 style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.85rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        BUDGET VS ACTUAL
      </h3>
      
      <div 
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '220px', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTrackerState(null)}
      >
        <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Grid */}
          <line x1="30" y1={SVG_HEIGHT} x2={SVG_WIDTH-30} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="30" y1={SVG_HEIGHT/2} x2={SVG_WIDTH-30} y2={SVG_HEIGHT/2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Lines */}
          <path 
            ref={pathBudgetRef}
            d={mounted ? pathBudget : initialPathBudget} 
            fill="none" 
            stroke="var(--text-secondary)" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            style={{ transition: 'd 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          <path 
            ref={pathActualRef}
            d={mounted ? pathActual : initialPathActual} 
            fill="none" 
            stroke="var(--accent-gold)" 
            strokeWidth="3"
            style={{ transition: 'd 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Tracker Vertical Line & Points */}
          {trackerState && (
            <g transform={`translate(${trackerState.svgX}, 0)`}>
              <line 
                x1="0" y1="0" x2="0" y2={SVG_HEIGHT} 
                stroke="var(--accent-gold)" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
              />
              <circle cx="0" cy={trackerState.budgetY} r="5" fill="var(--bg-primary)" stroke="var(--text-secondary)" strokeWidth="2" />
              <circle cx="0" cy={trackerState.actualY} r="5" fill="var(--bg-primary)" stroke="var(--accent-gold)" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* X-Axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 30px 0', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>
          {data.map(d => <span key={d.month}>{d.month}</span>)}
        </div>

        {/* Tooltip */}
        {trackerState && (
          <div 
            style={{
              position: 'absolute',
              left: `${(trackerState.svgX / SVG_WIDTH) * 100}%`,
              top: '10px',
              transform: `translate(${trackerState.svgX > SVG_WIDTH / 2 ? '-110%' : '10%'}, 0)`,
              background: 'rgba(10,10,10,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '16px',
              borderRadius: '8px',
              pointerEvents: 'none',
              zIndex: 10,
              minWidth: '180px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            <div style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: '12px', fontFamily: 'var(--font-primary)' }}>
              {data[trackerState.dataIndex].month} 2026
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Budget</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>₹{trackerState.budgetVal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Actual</span>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>₹{trackerState.actualVal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Difference</span>
              <span style={{ color: trackerState.budgetVal >= trackerState.actualVal ? 'var(--text-positive)' : '#C46C6C', fontSize: '0.9rem', fontWeight: 600 }}>
                ₹{Math.abs(trackerState.budgetVal - trackerState.actualVal).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
