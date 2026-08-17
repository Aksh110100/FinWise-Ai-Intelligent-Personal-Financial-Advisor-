import React, { useEffect, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201, 164, 108, 0.15) 0%, rgba(201, 164, 108, 0.05) 40%, rgba(201, 164, 108, 0) 70%)',
        filter: 'blur(50px)',
        transform: `translate(calc(${position.x}px - 300px), calc(${position.y}px - 300px))`,
        pointerEvents: 'none',
        zIndex: 9998,
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.2s cubic-bezier(0.15, 0.85, 0.35, 1.2), opacity 0.5s ease',
        willChange: 'transform, opacity',
      }}
    />
  );
};
