import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiBurstProps {
  trigger: boolean;
  onDone?: () => void;
}

const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ trigger, onDone }) => {
  const didBurst = useRef(false);

  useEffect(() => {
    if (trigger && !didBurst.current) {
      didBurst.current = true;
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#FF7EB9', '#FFD36E', '#B388FF', '#7AF5FF', '#FFB6B9', '#C3F6C7'],
      });
      setTimeout(() => {
        didBurst.current = false;
        if (onDone) onDone();
      }, 1200);
    }
  }, [trigger, onDone]);

  return null;
};

export default ConfettiBurst;
