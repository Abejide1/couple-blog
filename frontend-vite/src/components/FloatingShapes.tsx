import React, { useEffect, useRef } from 'react';

const shapeSets: Record<string, string[]> = {
  hearts: ['❤️', '💖', '💗', '💞', '💓', '💜', '💙', '💚', '💛', '🧡'],
  stars: ['⭐', '🌟', '✨', '💫', '🌠'],
  emojis: ['😊', '😍', '😎', '🥰', '😻', '😇', '😃', '🤩', '😋', '😸'],
  controllers: ['🎮', '🕹️', '👾', '💻', '🖱️', '⌨️'],
  mixed: ['❤️', '⭐', '💖', '✨', '😊', '🎮', '💜', '🌟', '👾', '💫', '🧡', '😃', '🕹️'],
  none: []
};

const fontStyles: Record<string, React.CSSProperties> = {
  bubbly: { fontFamily: '"Comic Sans MS", "Comic Sans", cursive', fontWeight: 900 },
  minimal: { fontFamily: 'Arial, sans-serif', fontWeight: 400 },
  classic: { fontFamily: 'serif', fontWeight: 700 },
  neutral: { fontFamily: 'Inter, Arial, sans-serif', fontWeight: 500 },
};

const FloatingShapes: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapeTypeRef = useRef<string>(localStorage.getItem('floatingIcons') || 'hearts');
  const iconStyleRef = useRef<string>(localStorage.getItem('iconStyle') || 'bubbly');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let running = true;
    function getShapes() {
      return shapeSets[shapeTypeRef.current] || shapeSets['hearts'];
    }
    function getFontStyle() {
      return fontStyles[iconStyleRef.current] || fontStyles['bubbly'];
    }
    const createShape = () => {
      const shapes = getShapes();
      if (!shapes.length) return;
      const shape = document.createElement('span');
      shape.innerText = shapes[Math.floor(Math.random() * shapes.length)];
      const style = getFontStyle();
      shape.style.position = 'absolute';
      shape.style.left = Math.random() * 100 + 'vw';
      shape.style.bottom = '-40px';
      shape.style.fontSize = `${18 + Math.random() * 36}px`;
      shape.style.opacity = '0.7';
      shape.style.pointerEvents = 'none';
      shape.style.transition = 'transform 7s linear, opacity 7s linear';
      shape.style.transform = `translateY(0)`;
      shape.style.fontFamily = style.fontFamily || '';
      shape.style.fontWeight = style.fontWeight?.toString() || '';
      container.appendChild(shape);
      setTimeout(() => {
        shape.style.transform = `translateY(-110vh)`;
        shape.style.opacity = '0';
      }, 100);
      setTimeout(() => {
        if (container.contains(shape)) container.removeChild(shape);
      }, 7200);
    };
    const interval = setInterval(() => { if (running) createShape(); }, 1100);
    // Listen for icon type/style changes
    const iconListener = (e: any) => {
      if (typeof e.detail === 'string') shapeTypeRef.current = e.detail;
    };
    const styleListener = (e: any) => {
      if (typeof e.detail === 'string') iconStyleRef.current = e.detail;
    };
    window.addEventListener('floatingIconsChanged', iconListener);
    window.addEventListener('iconStyleChanged', styleListener);
    return () => {
      running = false;
      clearInterval(interval);
      window.removeEventListener('floatingIconsChanged', iconListener);
      window.removeEventListener('iconStyleChanged', styleListener);
    };
  }, []);

  return <div ref={containerRef} style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />;
};

export default FloatingShapes;
