import React, { useEffect, useRef, useState } from 'react';

interface CategoryData {
  category: string;
  amount: string; // "₹18,000"
  percentage: number; // 33
}

interface CategoryAnalysisProps {
  data: CategoryData[];
}

export const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ data }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {data.map((cat, idx) => {
        // Find if it's the top category to give it gold accent
        const isTop = idx === 0; // Assuming sorted, or we can find max
        
        return (
          <div key={cat.category} className="category-progress-item">
            <div className="category-progress-header">
              <span style={{ textTransform: 'capitalize' }}>
                {cat.category.toLowerCase()}
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span>{cat.amount}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{cat.percentage}%</span>
              </div>
            </div>
            <div className="category-progress-track">
              <div 
                className={`category-progress-fill ${isTop ? 'gold' : ''}`}
                style={{ 
                  width: isVisible ? `${cat.percentage}%` : '0%',
                  transitionDelay: `${idx * 0.15}s` 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
