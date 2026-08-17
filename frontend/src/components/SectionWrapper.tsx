import React, { useEffect, useRef } from 'react';

interface SectionWrapperProps {
  id: string;
  index: number;
  onVisible: (index: number) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  index,
  onVisible,
  children,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(index);
        }
      },
      {
        // Trigger state switch when section occupies central viewport area
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [index, onVisible]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={`section-wrapper ${className}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '100px 0',
        position: 'relative',
        zIndex: 2,
        ...style,
      }}
    >
      {children}
    </section>
  );
};
