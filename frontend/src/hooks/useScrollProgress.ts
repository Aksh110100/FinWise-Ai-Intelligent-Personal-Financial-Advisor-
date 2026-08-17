import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollProgressOptions {
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

/**
 * Returns a scroll progress value (0–1) for a given container element.
 * Uses GSAP ScrollTrigger with scrub for direct scroll control.
 */
export function useScrollProgress(
  options: UseScrollProgressOptions = {}
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const {
    start = 'top top',
    end = 'bottom bottom',
    scrub = true,
    pin = false,
    markers = false,
  } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      scrub: scrub === true ? 1 : scrub,
      pin,
      markers,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [start, end, scrub, pin, markers]);

  return { containerRef, progress, progressRef };
}
