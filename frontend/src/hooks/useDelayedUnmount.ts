import { useState, useEffect } from 'react';

export function useDelayedUnmount(isOpen: boolean, delayTime: number = 300) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, delayTime);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, delayTime]);

  return { shouldRender, isClosing };
}
