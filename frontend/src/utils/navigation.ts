export const scrollToSection = (sectionId: string) => {
  const element = document.querySelector(sectionId);
  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.scrollY;
  const distance = Math.abs(targetPosition - window.scrollY);

  // Calculate dynamic duration based on distance
  // small distance: 500-700ms, medium: 800-1000ms, large: 1000-1400ms
  let duration = 1.2; // default seconds for lenis
  if (distance < 1000) {
    duration = 0.8;
  } else if (distance > 4000) {
    duration = 1.5;
  }

  // @ts-ignore - lenis attached to window in App.tsx
  if (window.lenis) {
    // @ts-ignore
    window.lenis.scrollTo(element, { 
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Custom premium easing
    });
  } else {
    // Fallback if Lenis isn't ready
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
