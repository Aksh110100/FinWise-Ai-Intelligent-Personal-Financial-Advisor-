import React, { useState, useMemo, useRef, useEffect } from 'react';

const graphData = [
  { month: "JAN", income: 72000, expenses: 41000 },
  { month: "FEB", income: 75000, expenses: 43000 },
  { month: "MAR", income: 78000, expenses: 45000 },
  { month: "APR", income: 79500, expenses: 48200 },
  { month: "MAY", income: 81000, expenses: 50000 },
  { month: "JUN", income: 83500, expenses: 52000 },
  { month: "JUL", income: 84000, expenses: 53500 },
  { month: "AUG", income: 85000, expenses: 54200 }
];

interface HoverState {
  x: number;
  incomeY: number;
  expenseY: number;
  data: typeof graphData[0];
}

export const CashFlowChart: React.FC = () => {
  const [hoverData, setHoverData] = useState<HoverState | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const viewBoxWidth = 800;
  const viewBoxHeight = 350;
  const plotLeft = 0;
  const plotRight = viewBoxWidth;
  const plotTop = 40; 
  const plotBottom = 300; 
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

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
    const scaleX = viewBoxWidth / rect.width;
    const svgX = mouseX * scaleX;

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

  useEffect(() => {
    if (!hoverData && points.length > 0) {
      setHoverData({
        x: points[points.length - 1].x,
        incomeY: points[points.length - 1].incomeY,
        expenseY: points[points.length - 1].expenseY,
        data: points[points.length - 1]
      });
    }
  }, [points]);

  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const renderTooltip = () => {
    if (!hoverData) return null;
    const isNearRight = hoverData.x > viewBoxWidth * 0.6;
    const netFlow = hoverData.data.income - hoverData.data.expenses;
    
    return (
      <div 
        className="graph-tooltip" 
        style={{ 
          position: 'absolute',
          left: hoverData.x, 
          top: '20px',
          transform: isNearRight ? 'translateX(calc(-100% - 20px))' : 'translateX(20px)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: 'none',
          transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 20
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.1em' }}>
          {hoverData.data.month}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '6px', fontSize: '0.9rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Income</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{formatCurrency(hoverData.data.income)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginBottom: '12px', fontSize: '0.9rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Expenses</span>
          <span style={{ color: 'var(--text-positive)', fontWeight: 500 }}>{formatCurrency(hoverData.data.expenses)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>Net Cash Flow</span>
          <span style={{ color: netFlow >= 0 ? 'var(--text-primary)' : 'var(--text-positive)', fontWeight: 600 }}>
            {netFlow >= 0 ? '+' : ''}{formatCurrency(netFlow)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="report-section-card" style={{ padding: '0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '24px 24px 0 24px' }}>
        <h3 className="report-section-title" style={{ marginBottom: '8px' }}>CASH FLOW</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Income vs expenses over the selected period.</p>
      </div>

      <div style={{ position: 'relative', height: '350px' }}>
        {renderTooltip()}

        <svg 
          ref={svgRef}
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onTouchStart={(e) => handleInteraction(e.touches[0].clientX)}
          onTouchMove={onTouchMove}
          onTouchEnd={onMouseLeave}
          style={{ width: '100%', height: '100%', cursor: 'crosshair', touchAction: 'none' }}
        >
          <defs>
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

          {hoverData && (
            <g style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease-out' }}>
              <line 
                x1={hoverData.x} y1={plotTop} 
                x2={hoverData.x} y2={plotBottom} 
                stroke="rgba(201, 164, 108, 0.4)" 
                strokeWidth="1" 
                strokeDasharray="4 4" 
                style={{ transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
              
              <circle 
                cx={hoverData.x} 
                cy={hoverData.incomeY} 
                r="4.5" 
                fill="var(--bg-primary)" 
                stroke="var(--text-primary)" 
                strokeWidth="2.5" 
                filter="url(#subtleGlow)" 
                style={{ transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
              />

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

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', position: 'absolute', bottom: '16px', left: '0', right: '0', pointerEvents: 'none' }}>
          {points.map((p, i) => {
            const isActive = isHovered && hoverData?.data.month === p.month;
            return (
              <span 
                key={p.month} 
                style={{ 
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.2s, font-weight 0.2s'
                }}
              >
                {p.month}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
