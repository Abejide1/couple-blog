import React, { useEffect, useRef } from 'react';

const shapes = [
  '❤️', '⭐', '💖', '✨', '💙', '💜', '💛', '💚', '🧡', '💗', '💞', '💫'
];

const FloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const createShape = () => {
      const shape = document.createElement('span');
      shape.innerText = shapes[Math.floor(Math.random() * shapes.length)];
      shape.style.position = 'absolute';
      shape.style.left = Math.random() * 100 + 'vw';
      shape.style.bottom = '-40px';
      shape.style.fontSize = `${18 + Math.random() * 36}px`;
      shape.style.opacity = '0.7';
      shape.style.pointerEvents = 'none';
      shape.style.transition = 'transform 7s linear, opacity 7s linear';
      shape.style.transform = `translateY(0)`;
      container.appendChild(shape);
      setTimeout(() => {
        shape.style.transform = `translateY(-110vh)`;
        shape.style.opacity = '0';
      }, 100);
      setTimeout(() => {
        container.removeChild(shape);
      }, 7200);
    };
    const interval = setInterval(createShape, 1100);
    return () => clearInterval(interval);
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />;
};

export default FloatingShapes;
