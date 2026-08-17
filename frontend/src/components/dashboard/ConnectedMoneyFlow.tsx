import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { AnimatedNumber } from './AnimatedNumber';

interface ConnectedMoneyFlowProps {
  income: string;
  spending: string;
  saving: string;
  investment: string;
}

export const ConnectedMoneyFlow: React.FC<ConnectedMoneyFlowProps> = ({
  income, spending, saving, investment
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section id="money" className="cinematic-section" ref={targetRef}>
      <div className={`section-divider ${isIntersecting ? 'visible delay-1' : ''}`}>
        <span>FINANCIAL FLOW</span>
      </div>

      <div style={flowContainerStyle}>
        <FlowNode label="INCOME" value={income} delay="delay-2" isVisible={isIntersecting} />
        <FlowConnector delay="delay-3" isVisible={isIntersecting} />
        
        <FlowNode label="SPENDING" value={spending} delay="delay-4" isVisible={isIntersecting} />
        <FlowConnector delay="delay-5" isVisible={isIntersecting} />
        
        <FlowNode label="SAVING" value={saving} delay="delay-6" isVisible={isIntersecting} />
        <FlowConnector delay="delay-7" isVisible={isIntersecting} />
        
        <FlowNode label="INVESTMENT" value={investment} delay="delay-8" isVisible={isIntersecting} isFinal />
      </div>
    </section>
  );
};

const FlowNode: React.FC<{label: string, value: string, delay: string, isVisible: boolean, isFinal?: boolean}> = 
({ label, value, delay, isVisible, isFinal }) => (
  <div style={nodeStyle} className={`anim-fade-up ${isVisible ? `visible ${delay}` : ''}`}>
    <div style={nodeLabelStyle}>{label}</div>
    <div style={{...nodeValueStyle, color: isFinal ? 'var(--accent-gold)' : 'var(--text-primary)'}}>
      <AnimatedNumber value={value} trigger={isVisible} duration={1500} />
    </div>
  </div>
);

const FlowConnector: React.FC<{delay: string, isVisible: boolean}> = ({ delay, isVisible }) => (
  <div style={connectorWrapperStyle} className={`anim-fade-up ${isVisible ? `visible ${delay}` : ''}`}>
    <div style={connectorLineStyle}></div>
  </div>
);

// Styles
const flowContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '60px',
};

const nodeStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const nodeLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
};

const nodeValueStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(2rem, 4vw, 3rem)',
  fontWeight: 500,
  letterSpacing: '-0.02em',
};

const connectorWrapperStyle: React.CSSProperties = {
  height: '80px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const connectorLineStyle: React.CSSProperties = {
  width: '1px',
  height: '100%',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
};
