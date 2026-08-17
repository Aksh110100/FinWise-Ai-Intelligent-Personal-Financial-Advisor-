import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/**
 * Initialize Lenis smooth scroll and sync it with GSAP ScrollTrigger.
 * This ensures scrub-based animations respond correctly to Lenis's smoothed scroll.
 */
export function initScrollManager(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Sync Lenis scroll position with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  // Use GSAP's ticker for the Lenis RAF loop (keeps them in sync)
  gsap.ticker.add((time) => {
    lenisInstance?.raf(time * 1000);
  });

  // Disable Lenis's own RAF since GSAP ticker handles it
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

/**
 * Destroy the Lenis instance and clean up GSAP ScrollTrigger.
 */
export function destroyScrollManager(): void {
  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

/**
 * Get the current Lenis instance.
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}
