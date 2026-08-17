import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';

export const IncomeExpenseGraph: React.FC = () => {
  const { dashboardData } = useDashboard();
  const [filter, setFilter] = useState('1M');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(800);
  
  // Mock data for the graph
  const dataPoints = [
    { label: 'JAN', income: 75000, expense: 52000 },
    { label: 'FEB', income: 78000, expense: 49000 },
    { label: 'MAR', income: 82000, expense: 55000 },
    { label: 'APR', income: 79000, expense: 51000 },
    { label: 'MAY', income: 81000, expense: 53000 },
    { label: 'JUN', income: 84000, expense: 50000 },
    { label: 'JUL', income: 85000, expense: 54000 },
    { label: 'AUG', income: 85000, expense: 54200 },
  ];

  const maxVal = 100000;
  const svgHeight = 300;

  useEffect(() => {
    if (containerRef.current) {
      setSvgWidth(containerRef.current.clientWidth);
      
      const handleResize = () => {
        if (containerRef.current) {
          setSvgWidth(containerRef.current.clientWidth);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Find closest index
    const segmentWidth = svgWidth / (dataPoints.length - 1);
    const index = Math.min(
      dataPoints.length - 1,
      Math.max(0, Math.round(x / segmentWidth))
    );
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const generatePath = (key: 'income' | 'expense') => {
    const segmentWidth = svgWidth / (dataPoints.length - 1);
    let path = '';
    
    dataPoints.forEach((pt, i) => {
      const x = i * segmentWidth;
      const y = svgHeight - (pt[key] / maxVal) * svgHeight;
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>INCOME VS EXPENSES</h3>
        <div style={filterGroupStyle}>
          {['7D', '1M', '3M', '6M', '1Y'].map(f => (
            <button 
              key={f} 
              style={{...filterBtnStyle, color: filter === f ? 'var(--text-primary)' : 'var(--text-secondary)'}}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={graphWrapperStyle} ref={containerRef}>
        {hoverIndex !== null && (
          <div style={{
            ...tooltipStyle,
            left: `${(hoverIndex / (dataPoints.length - 1)) * 100}%`,
            transform: `translateX(-50%)`,
          }}>
            <div style={tooltipMonthStyle}>{dataPoints[hoverIndex].label}</div>
            <div style={tooltipMetricStyle}>
              <span>Income</span>
              <span style={{color: 'var(--text-primary)'}}>₹{dataPoints[hoverIndex].income.toLocaleString('en-IN')}</span>
            </div>
            <div style={tooltipMetricStyle}>
              <span>Expenses</span>
              <span style={{color: 'var(--text-primary)'}}>₹{dataPoints[hoverIndex].expense.toLocaleString('en-IN')}</span>
            </div>
            <div style={tooltipMetricStyle}>
              <span>Savings</span>
              <span style={{color: 'var(--accent-emerald)'}}>₹{(dataPoints[hoverIndex].income - dataPoints[hoverIndex].expense).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <svg 
          width="100%" 
          height={svgHeight} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{overflow: 'visible', cursor: 'crosshair'}}
        >
          {/* Grid lines */}
          <line x1="0" y1={svgHeight} x2="100%" y2={svgHeight} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          {/* Tracking Line */}
          {hoverIndex !== null && (
            <line 
              x1={(hoverIndex / (dataPoints.length - 1)) * svgWidth}
              y1="0"
              x2={(hoverIndex / (dataPoints.length - 1)) * svgWidth}
              y2={svgHeight}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          )}

          {/* Income Line */}
          <path 
            d={generatePath('income')}
            fill="none"
            stroke="var(--text-primary)"
            strokeWidth="2"
            className="smooth-path draw-line"
          />
          
          {/* Expense Line */}
          <path 
            d={generatePath('expense')}
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="2"
            className="smooth-path draw-line"
          />

          {/* Hover Points */}
          {hoverIndex !== null && (
            <>
              <circle 
                cx={(hoverIndex / (dataPoints.length - 1)) * svgWidth} 
                cy={svgHeight - (dataPoints[hoverIndex].income / maxVal) * svgHeight} 
                r="4" 
                fill="var(--bg-primary)" 
                stroke="var(--text-primary)"
                strokeWidth="2"
              />
              <circle 
                cx={(hoverIndex / (dataPoints.length - 1)) * svgWidth} 
                cy={svgHeight - (dataPoints[hoverIndex].expense / maxVal) * svgHeight} 
                r="4" 
                fill="var(--bg-primary)" 
                stroke="var(--text-secondary)"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  padding: '0 2rem',
  marginBottom: '4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1.2rem',
  color: 'var(--text-secondary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  margin: 0
};

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  background: 'rgba(255,255,255,0.03)',
  padding: '0.25rem 0.5rem',
  borderRadius: '20px',
  border: '1px solid var(--glass-border)'
};

const filterBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.8rem',
  cursor: 'pointer',
  padding: '0.25rem 0.5rem',
  transition: 'var(--transition-smooth)'
};

const graphWrapperStyle: React.CSSProperties = {
  width: '100%',
  position: 'relative',
  paddingTop: '3rem' // space for tooltip
};

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-1rem',
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  minWidth: '150px',
  pointerEvents: 'none',
  zIndex: 10,
  transition: 'left 0.1s ease-out',
  boxShadow: 'var(--glass-shadow)'
};

const tooltipMonthStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  color: 'var(--accent-gold)',
  fontSize: '0.9rem',
  letterSpacing: '0.05em',
  marginBottom: '0.25rem'
};

const tooltipMetricStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.85rem',
  color: 'var(--text-secondary)'
};

// Add global styles for animation if needed
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .smooth-path {
      transition: d 0.3s ease;
    }
    .draw-line {
      stroke-dasharray: 2000;
      stroke-dashoffset: 0;
      animation: draw 2s ease-out forwards;
    }
    @keyframes draw {
      from { stroke-dashoffset: 2000; }
      to { stroke-dashoffset: 0; }
    }
  `;
  document.head.appendChild(style);
}
