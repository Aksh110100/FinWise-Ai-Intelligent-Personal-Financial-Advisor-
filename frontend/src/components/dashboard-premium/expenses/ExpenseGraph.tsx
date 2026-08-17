import React, { useRef, useState } from 'react';

// Hardcoded for demo purposes since we just need the visual representation
const SVG_WIDTH = 800;
const SVG_HEIGHT = 240;

const MOCK_DATAPOINTS = [
  { day: '01 Aug', value: 1200, category: 'Food' },
  { day: '03 Aug', value: 3400, category: 'Shopping' },
  { day: '05 Aug', value: 850, category: 'Transport' },
  { day: '08 Aug', value: 4200, category: 'Housing' },
  { day: '10 Aug', value: 1100, category: 'Food' },
  { day: '12 Aug', value: 6500, category: 'Shopping' },
  { day: '14 Aug', value: 2450, category: 'Food' },
];

export const ExpenseGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [trackerState, setTrackerState] = useState<{ svgX: number; svgY: number; dataIndex: number; value: number } | null>(null);

  const maxValue = Math.max(...MOCK_DATAPOINTS.map(d => d.value)) * 1.2;

  const points = MOCK_DATAPOINTS.map((d, i) => {
    const x = (i / (MOCK_DATAPOINTS.length - 1)) * SVG_WIDTH;
    const y = SVG_HEIGHT - (d.value / maxValue) * SVG_HEIGHT;
    return { x, y, ...d };
  });

  const pathData = `M 0,${SVG_HEIGHT} ` + points.map((p, i) => {
    if (i === 0) return `L ${p.x},${p.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `C ${cpX},${prev.y} ${cpX},${p.y} ${p.x},${p.y}`;
  }).join(' ');

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !pathRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    const svgX = ratio * SVG_WIDTH;

    let minL = 0;
    let maxL = pathRef.current.getTotalLength();
    let targetL = maxL / 2;
    let point = pathRef.current.getPointAtLength(targetL);
    
    // Fast binary search to find length matching the mouse's X coordinate
    for (let i = 0; i < 12; i++) {
      if (point.x < svgX) minL = targetL;
      else maxL = targetL;
      targetL = (minL + maxL) / 2;
      point = pathRef.current.getPointAtLength(targetL);
    }
    
    const dataIndex = Math.round(ratio * (points.length - 1));
    const interpolatedValue = Math.round(maxValue - (point.y / SVG_HEIGHT) * maxValue);
    
    setTrackerState({ svgX, svgY: point.y, dataIndex, value: interpolatedValue });
  };

  const handleMouseLeave = () => {
    setTrackerState(null);
  };

  return (
    <div 
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '240px', marginTop: '20px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} preserveAspectRatio="none">
        
        {/* Subtle grid lines */}
        <line x1="0" y1={SVG_HEIGHT} x2={SVG_WIDTH} y2={SVG_HEIGHT} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="0" y1={SVG_HEIGHT / 2} x2={SVG_WIDTH} y2={SVG_HEIGHT / 2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0" y1="0" x2={SVG_WIDTH} y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />

        {/* The line */}
        <path 
          ref={pathRef}
          d={pathData} 
          fill="none" 
          stroke="var(--text-primary)" 
          strokeWidth="3"
          style={{ filter: 'drop-shadow(0px 8px 16px rgba(255,255,255,0.2))' }}
        />

        {/* Tracker */}
        {trackerState && (
          <g transform={`translate(${trackerState.svgX}, 0)`}>
            <line 
              x1="0" y1="0" x2="0" y2={SVG_HEIGHT} 
              stroke="var(--accent-gold)" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
            />
            <circle cx="0" cy={trackerState.svgY} r="6" fill="#050505" stroke="var(--accent-gold)" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Tooltip HTML for better text rendering */}
      {trackerState && (
        <div 
          style={{
            position: 'absolute',
            left: `${(trackerState.svgX / SVG_WIDTH) * 100}%`,
            top: '-20px',
            transform: `translate(${trackerState.svgX > SVG_WIDTH / 2 ? '-110%' : '10%'}, -100%)`,
            background: 'rgba(12,12,12,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
            minWidth: '160px',
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase' }}>
            {points[trackerState.dataIndex].day}
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total spending</span>
            <div style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              ₹{trackerState.value.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Largest category</span>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              {points[trackerState.dataIndex].category}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
