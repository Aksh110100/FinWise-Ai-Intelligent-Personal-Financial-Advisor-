import React, { useEffect, useRef, useState } from 'react';

export const AIExpenseAnalysis: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
        "Your food spending is 18% higher than your three-month average."
      </p>

      {/* Comparison Bars */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>CURRENT</span>
          <span style={{ fontFamily: 'var(--font-primary)' }}>₹12,400</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '12px' }}>
          <div style={{ width: isVisible ? '100%' : '0%', height: '100%', background: 'var(--text-negative)', borderRadius: '2px', transition: 'width 1s ease 0.2s' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>AVERAGE</span>
          <span style={{ fontFamily: 'var(--font-primary)' }}>₹10,500</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginBottom: '12px' }}>
          <div style={{ width: isVisible ? '85%' : '0%', height: '100%', background: 'var(--text-secondary)', borderRadius: '2px', transition: 'width 1s ease 0.4s' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>DIFFERENCE</span>
          <span style={{ color: 'var(--text-negative)', fontFamily: 'var(--font-primary)' }}>+₹1,900</span>
        </div>
      </div>

    </div>
  );
};
