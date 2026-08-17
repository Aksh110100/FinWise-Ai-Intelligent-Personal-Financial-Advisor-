import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export const CinematicTrajectory: React.FC = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className="cinematic-section" ref={targetRef}>
      <div className={`section-divider ${isIntersecting ? 'visible delay-1' : ''}`}>
        <span>WHERE ARE YOU HEADED?</span>
      </div>

      <div style={containerStyle} className={`anim-fade-up ${isIntersecting ? 'visible delay-2' : ''}`}>
        <div style={svgContainerStyle}>
          {/* Custom SVG trajectory drawing */}
          <svg viewBox="0 0 800 400" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            {/* Base grid line */}
            <line x1="100" y1="350" x2="700" y2="350" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Current Path Line */}
            <path 
              d="M 100 350 Q 400 350 700 200" 
              fill="none" 
              stroke="var(--text-secondary)" 
              strokeWidth="2"
              className={`draw-line ${isIntersecting ? 'drawn' : ''}`}
            />
            
            {/* FinWise Optimized Path Line */}
            <path 
              d="M 100 350 C 300 350 500 250 700 50" 
              fill="none" 
              stroke="var(--accent-gold)" 
              strokeWidth="3"
              className={`draw-line ${isIntersecting ? 'drawn delay-4' : ''}`}
            />
            
            {/* Points & Labels */}
            {/* Current */}
            <circle cx="100" cy="350" r="4" fill="var(--text-primary)" className={`fade-element ${isIntersecting ? 'visible delay-3' : ''}`} />
            <text x="100" y="380" fill="var(--text-secondary)" fontSize="12" textAnchor="middle" letterSpacing="2" className={`fade-element ${isIntersecting ? 'visible delay-3' : ''}`}>TODAY</text>
            <text x="100" y="320" fill="var(--text-primary)" fontSize="20" fontFamily="var(--font-primary)" textAnchor="middle" className={`fade-element ${isIntersecting ? 'visible delay-3' : ''}`}>₹2.4L</text>
            
            {/* 5 Years */}
            <line x1="400" y1="350" x2="400" y2="285" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" className={`fade-element ${isIntersecting ? 'visible delay-5' : ''}`} />
            <circle cx="400" cy="285" r="4" fill="var(--text-secondary)" className={`fade-element ${isIntersecting ? 'visible delay-5' : ''}`} />
            <circle cx="400" cy="190" r="4" fill="var(--accent-gold)" className={`fade-element ${isIntersecting ? 'visible delay-5' : ''}`} />
            <text x="400" y="380" fill="var(--text-secondary)" fontSize="12" textAnchor="middle" letterSpacing="2" className={`fade-element ${isIntersecting ? 'visible delay-5' : ''}`}>5 YEARS</text>
            <text x="400" y="160" fill="var(--accent-gold)" fontSize="20" fontFamily="var(--font-primary)" textAnchor="middle" className={`fade-element ${isIntersecting ? 'visible delay-5' : ''}`}>₹7.2L</text>
            
            {/* 10 Years */}
            <line x1="700" y1="350" x2="700" y2="200" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" className={`fade-element ${isIntersecting ? 'visible delay-6' : ''}`} />
            <circle cx="700" cy="200" r="4" fill="var(--text-secondary)" className={`fade-element ${isIntersecting ? 'visible delay-6' : ''}`} />
            <circle cx="700" cy="50" r="4" fill="var(--accent-gold)" className={`fade-element ${isIntersecting ? 'visible delay-6' : ''}`} />
            <text x="700" y="380" fill="var(--text-secondary)" fontSize="12" textAnchor="middle" letterSpacing="2" className={`fade-element ${isIntersecting ? 'visible delay-6' : ''}`}>10 YEARS</text>
            <text x="700" y="230" fill="var(--text-secondary)" fontSize="20" fontFamily="var(--font-primary)" textAnchor="middle" className={`fade-element ${isIntersecting ? 'visible delay-6' : ''}`}>₹12L</text>
            <text x="700" y="30" fill="var(--accent-gold)" fontSize="24" fontFamily="var(--font-primary)" textAnchor="middle" className={`fade-element ${isIntersecting ? 'visible delay-6' : ''}`}>₹16.8L</text>
            
            {/* Legend */}
            <text x="650" y="90" fill="var(--accent-gold)" fontSize="10" letterSpacing="1" className={`fade-element ${isIntersecting ? 'visible delay-7' : ''}`}>FINWISE PATH</text>
            <text x="650" y="250" fill="var(--text-secondary)" fontSize="10" letterSpacing="1" className={`fade-element ${isIntersecting ? 'visible delay-7' : ''}`}>CURRENT PATH</text>
          </svg>
        </div>
      </div>
    </section>
  );
};

// Styles
const containerStyle: React.CSSProperties = {
  paddingTop: '60px',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const svgContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  height: 'auto',
  aspectRatio: '2 / 1',
  position: 'relative',
};

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .draw-line {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      transition: stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .draw-line.drawn {
      stroke-dashoffset: 0;
    }
    .fade-element {
      opacity: 0;
      transition: opacity 0.8s ease;
    }
    .fade-element.visible {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}
