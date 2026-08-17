import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: string; // e.g. "₹54,200" or "₹85K"
  duration?: number;
  trigger: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 1500, trigger }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!trigger) return;

    // Parse numeric parts and non-numeric parts
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1];
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3];
    const targetNum = parseFloat(numStr);

    if (isNaN(targetNum)) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const currentNum = targetNum * easeProgress;
      
      // Format number
      let formattedNum = '';
      if (Number.isInteger(targetNum)) {
        formattedNum = Math.round(currentNum).toLocaleString('en-IN');
      } else {
        formattedNum = currentNum.toLocaleString('en-IN', { 
          minimumFractionDigits: 1, 
          maximumFractionDigits: 1 
        });
      }

      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        setDisplayValue(value); // Ensure exactly final value
      }
    };

    requestAnimationFrame(updateNumber);
  }, [value, duration, trigger]);

  return <span>{trigger ? displayValue : value.replace(/[\d,.]+/g, '0')}</span>;
};
