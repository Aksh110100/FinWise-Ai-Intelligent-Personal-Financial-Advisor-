import { useEffect, useState, useRef } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          // Optional: stop observing once it intersects to prevent re-animation
          if (targetRef.current) observer.unobserve(targetRef.current);
        }
      },
      { threshold: 0.2, ...options }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { targetRef, isIntersecting };
};
