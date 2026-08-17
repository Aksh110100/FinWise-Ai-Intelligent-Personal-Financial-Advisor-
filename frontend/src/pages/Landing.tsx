import React, { useEffect } from 'react';
import Lenis from 'lenis';

// Layout & Components
import { Navbar } from '../components/Navbar';
import { Hero } from '../sections/Hero';
import { HowItWorks } from '../sections/HowItWorks';
import { GlobalFinancialBackground } from '../components/GlobalFinancialBackground/GlobalFinancialBackground';

// Sections
import { AiFinancialAdvisor } from '../sections/AiFinancialAdvisor';
import { FinancialXRay } from '../sections/FinancialXRay';
import { FutureSimulation } from '../sections/FutureSimulation';
import { AskYourFinances } from '../sections/AskYourFinances';
import { FinancialHealthScore } from '../sections/FinancialHealthScore';
import { FinalCTA } from '../sections/FinalCTA';
import { Footer } from '../sections/Footer';

export const Landing: React.FC = () => {

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    // @ts-ignore
    window.lenis = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div style={globalWrapperStyle}>
      <GlobalFinancialBackground />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <HowItWorks />
        <AiFinancialAdvisor />
        <FinancialXRay />
        <FutureSimulation />
        <AskYourFinances />
        <FinancialHealthScore />
        <FinalCTA />
      </main>
      
      <Footer />
    </div>
  );
};

// Global Layout CSS Style specifications
const globalWrapperStyle: React.CSSProperties = {
  backgroundColor: '#050505',
  color: 'var(--text-primary)',
  minHeight: '100vh',
  width: '100%',
};

export default Landing;
