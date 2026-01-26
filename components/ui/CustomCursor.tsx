
import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const trailer = trailerRef.current;
    if (!cursor || !trailer) return;

    // Position State
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      
      // Hardware cursor is hidden, so we need the dot to be instant (0 latency)
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        cursor.style.opacity = '1';
      }
      if (trailer) {
          trailer.style.opacity = '1';
      }
    };

    // Linear Interpolation
    const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    };

    const animate = () => {
      // Increased factor to 0.35 for tighter, faster follow (less "floaty")
      current.x = lerp(current.x, target.x, 0.35);
      current.y = lerp(current.y, target.y, 0.35);
      
      if (trailer) {
        trailer.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }
      
      requestAnimationFrame(animate);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (
        targetEl.tagName === 'A' || 
        targetEl.tagName === 'BUTTON' || 
        targetEl.closest('a') || 
        targetEl.closest('button') ||
        targetEl.classList.contains('hover-trigger')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Main Dot - Elevated Z-Index */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-accent-lime rounded-full pointer-events-none z-[100000] opacity-0 mix-blend-difference will-change-transform"
        style={{ 
            marginTop: '-4px', 
            marginLeft: '-4px'
        }} 
      />
      
      {/* Magnetic Trailer Ring - Elevated Z-Index */}
      <div 
        ref={trailerRef} 
        className={`fixed top-0 left-0 border border-accent-lime rounded-full pointer-events-none z-[99999] opacity-0 mix-blend-difference transition-all duration-300 ease-out will-change-transform
            ${isHovering ? 'w-12 h-12 border-2' : 'w-5 h-5 border'}
        `}
        style={{ 
            marginTop: isHovering ? '-24px' : '-10px', 
            marginLeft: isHovering ? '-24px' : '-10px'
        }}
      />
    </>
  );
};
