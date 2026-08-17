import { useEffect, useRef, useState } from 'react';

interface MouseParallax {
  rotateX: number;
  rotateY: number;
  mouseX: number;
  mouseY: number;
}

/**
 * Tracks mouse position relative to a container and returns
 * subtle rotation values for 3D tilt effect.
 * Values range from -maxRotation to +maxRotation degrees.
 */
export function useMouseParallax(maxRotation: number = 8): MouseParallax & {
  containerRef: React.RefObject<HTMLDivElement>;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<MouseParallax>({
    rotateX: 0,
    rotateY: 0,
    mouseX: 0.5,
    mouseY: 0.5,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalize to -1 to 1
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = nx;
      targetY = ny;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      // Lerp toward target for smooth movement
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      setState({
        rotateX: -currentY * maxRotation,
        rotateY: currentX * maxRotation,
        mouseX: (currentX + 1) / 2,
        mouseY: (currentY + 1) / 2,
      });

      rafId = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [maxRotation]);

  return { ...state, containerRef };
}
