import React, { useState, useMemo, useEffect, useRef } from 'react';

const timeframes = ['7D', '1M', '3M', '6M', '1Y'];

// Mock data structured as requested
const graphData = [
  { month: "JAN", income: 72000, expenses: 41000 },
  { month: "FEB", income: 75000, expenses: 43000 },
  { month: "MAR", income: 78000, expenses: 45000 },
  { month: "APR", income: 79500, expenses: 48200 },
  { month: "MAY", income: 81000, expenses: 50000 },
  { month: "JUN", income: 83500, expenses: 52000 },
  { month: "JUL", income: 84000, expenses: 53500 },
  { month: "AUG", income: 85000, expenses: 54200 },
  { month: "SEP", income: 87000, expenses: 56000 },
  { month: "OCT", income: 89000, expenses: 57500 },
  { month: "NOV", income: 91000, expenses: 59000 }
];

interface HoverState {
  x: number;
  incomeY: number;
  expenseY: number;
  data: typeof graphData[0];
}

export const MainGraph: React.FC = () => {
  const [activeFrame, setActiveFrame] = useState('1M');
  const [hoverData, setHoverData] = useState<HoverState | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // SVG Dimension Constants
  const viewBoxWidth = 800;
  const viewBoxHeight = 300;
  
  // Plot area bounds
  const plotLeft = 0;
  const plotRight = viewBoxWidth;
  const plotTop = 40; 
  const plotBottom = 260; 
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  // Calculate scales mathematically
  const { points, maxValue, minValue } = useMemo(() => {
    let max = 0;
    let min = Infinity;
    graphData.forEach(d => {
      if (d.income > max) max = d.income;
      if (d.expenses > max) max = d.expenses;
      if (d.income < min) min = d.income;
      if (d.expenses < min) min = d.expenses;
    });

    const range = max - min;
    const paddedMax = max + (range * 0.1);
    const paddedMin = Math.max(0, min - (range * 0.1));

    const calculatedPoints = graphData.map((d, index) => {
      const x = plotLeft + (index * (plotWidth / (graphData.length - 1)));
      const incomeY = plotBottom - (((d.income - paddedMin) / (paddedMax - paddedMin)) * plotHeight);
      const expenseY = plotBottom - (((d.expenses - paddedMin) / (paddedMax - paddedMin)) * plotHeight);
      return { ...d, x, incomeY, expenseY };
    });

    return { points: calculatedPoints, maxValue: paddedMax, minValue: paddedMin };
  }, [plotWidth, plotHeight]);

  const generateSmoothPath = (pts: {x: number, y: number}[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const incomePath = generateSmoothPath(points.map(p => ({ x: p.x, y: p.incomeY })));
  const expensePath = generateSmoothPath(points.map(p => ({ x: p.x, y: p.expenseY })));

  const handleInteraction = (clientX: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    
    // Scale screen coordinates to viewBox
    const scaleX = viewBoxWidth / rect.width;
    const svgX = mouseX * scaleX;

    // Find nearest data point strictly by X
    let closestPoint = points[0];
    let minDistance = Infinity;

    points.forEach((p) => {
      const dist = Math.abs(p.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestPoint = p;
      }
    });

    setHoverData({
      x: closestPoint.x,
      incomeY: closestPoint.incomeY,
      expenseY: closestPoint.expenseY,
      data: closestPoint
    });
    setIsHovered(true);
  };

  const onMouseMove = (e: React.MouseEvent) => handleInteraction(e.clientX);
  const onTouchMove = (e: React.TouchEvent) => handleInteraction(e.touches[0].clientX);

  const onMouseLeave = () => setIsHovered(false);

  // Initialize hover data so it's ready to fade in
  useEffect(() => {
    if (!hoverData && points.length > 0) {
      setHoverData({
        x: points[0].x,
        incomeY: points[0].incomeY,
        expenseY: points[0].expenseY,
        data: points[0]
      });
    }
  }, [points]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const renderTooltip = () => {
    if (!hoverData) return null;
    const isNearRight = hoverData.x > viewBoxWidth * 0.6;
    
    return (
      <div 
        className="graph-tooltip" 
        style={{ 
          position: 'absolute',
          left: hoverData.x, 
          top: '40px', // Anchor relative to vertical tracker top
          transform: isNearRight ? 'translateX(calc(-100% - 20px))' : 'translateX(20px)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <div className="tooltip-label">{hoverData.data.month}</div>
        <div className="tooltip-row">
          <span className="dot" style={{ background: 'rgba(255,255,255,0.9)' }}></span>
          <span>Income</span>
          <span className="tooltip-val" style={{ color: 'rgba(255,255,255,0.9)' }}>{formatCurrency(hoverData.data.income)}</span>
        </div>
        <div className="tooltip-row">
          <span className="dot" style={{ background: 'var(--text-positive)' }}></span>
          <span>Expenses</span>
          <span className="tooltip-val" style={{ color: 'var(--text-positive)' }}>{formatCurrency(hoverData.data.expenses)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card main-graph-card anim-fade-up delay-6" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="graph-header">
        <div>
          <h3 className="card-title">INCOME VS EXPENSES</h3>
        </div>
        <div className="timeframe-controls">
          {timeframes.map(tf => (
            <button 
              key={tf} 
              className={`tf-btn ${activeFrame === tf ? 'active' : ''}`}
              onClick={() => setActiveFrame(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="graph-container" style={{ position: 'relative' }}>
        {renderTooltip()}

        <svg 
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="main-svg-graph" 
          preserveAspectRatio="none"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onTouchStart={(e) => handleInteraction(e.touches[0].clientX)}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseLeave}
          style={{ cursor: 'crosshair', touchAction: 'none' }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1={plotBottom} x2={viewBoxWidth} y2={plotBottom} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1={plotBottom - (plotHeight / 2)} x2={viewBoxWidth} y2={plotBottom - (plotHeight / 2)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <line x1="0" y1={plotTop} x2={viewBoxWidth} y2={plotTop} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

          {/* Lines */}
          <path d={expensePath} fill="none" stroke="var(--text-positive)" strokeWidth="3" className="svg-draw-line-slow" />
          <path d={incomePath} fill="none" stroke="var(--text-primary)" strokeWidth="3" className="svg-draw-line-slow" />

          {/* Render hover interactive elements */}
          {hoverData && (
            <g style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease-out' }}>
              {/* Full Height Vertical Tracker */}
              <line 
                x1={hoverData.x} y1={plotTop} 
                x2={hoverData.x} y2={plotBottom} 
                stroke="rgba(255,255,255,0.18)" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
                style={{ transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              
              {/* Income Marker Ring */}
              <circle 
                cx={hoverData.x} 
                cy={hoverData.incomeY} 
                r="4.5" 
                fill="var(--bg-primary)" 
                stroke="rgba(255,255,255,0.9)" 
                strokeWidth="2.5" 
                filter="url(#subtleGlow)" 
                style={{ transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />

              {/* Expense Marker Ring */}
              <circle 
                cx={hoverData.x} 
                cy={hoverData.expenseY} 
                r="4.5" 
                fill="var(--bg-primary)" 
                stroke="var(--text-positive)" 
                strokeWidth="2.5" 
                filter="url(#subtleGlow)"
                style={{ transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
            </g>
          )}
        </svg>

        <div className="graph-x-axis" style={{ pointerEvents: 'none' }}>
          {points.map((p, i) => {
            // Render alternating labels but highlight if active
            const isActive = isHovered && hoverData?.data.month === p.month;
            if (i % 2 === 0 || isActive) {
              return (
                <span 
                  key={p.month} 
                  style={{ 
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'color 0.2s, font-weight 0.2s',
                    position: isActive ? 'relative' : 'static',
                    zIndex: isActive ? 10 : 1
                  }}
                >
                  {p.month}
                </span>
              );
            }
            return <span key={p.month} style={{ visibility: 'hidden' }}>{p.month}</span>;
          })}
        </div>
      </div>
    </div>
  );
};
