import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface HeroSnapshotProps {
  userName: string;
  balance: string;
}

export const HeroSnapshot: React.FC<HeroSnapshotProps> = ({ userName, balance }) => {
  const { targetRef, isIntersecting } = useIntersectionObserver();

  return (
    <section id="overview" className="cinematic-section hero-section" ref={targetRef}>
      <div className={`anim-fade-up ${isIntersecting ? 'visible delay-1' : ''}`}>
        <h2 style={greetingStyle}>GOOD MORNING, {userName.toUpperCase()}.</h2>
        <h1 style={titleStyle}>
          YOUR MONEY<br/>
          IS MOVING<br/>
          IN THE RIGHT<br/>
          DIRECTION.
        </h1>
      </div>

      <div style={balanceContainerStyle} className={`anim-fade-up ${isIntersecting ? 'visible delay-3' : ''}`}>
        <div style={balanceAmountStyle}>
          <AnimatedNumber value={balance} trigger={isIntersecting} duration={2000} />
        </div>
        <div style={balanceLabelStyle}>AVAILABLE THIS MONTH</div>
        <div style={healthBadgeStyle}>↑ 12.4% HEALTHIER THAN LAST MONTH</div>
      </div>
    </section>
  );
};

// Styles
const greetingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: 'var(--text-secondary)',
  marginBottom: '24px',
};

const titleStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(3rem, 6vw, 5rem)',
  fontWeight: 500,
  lineHeight: 1.05,
  letterSpacing: '-0.03em',
  color: 'var(--text-primary)',
  marginBottom: '80px',
};

const balanceContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '12px',
};

const balanceAmountStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: 'clamp(5rem, 10vw, 8rem)',
  fontWeight: 500,
  lineHeight: 0.9,
  letterSpacing: '-0.04em',
  color: 'var(--accent-gold)',
};

const balanceLabelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-primary)',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'var(--text-secondary)',
  marginLeft: '8px',
};

const healthBadgeStyle: React.CSSProperties = {
  marginTop: '16px',
  marginLeft: '8px',
  padding: '6px 16px',
  border: '1px solid rgba(162, 194, 164, 0.3)',
  borderRadius: '20px',
  color: 'var(--text-positive)',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  display: 'inline-block',
};
