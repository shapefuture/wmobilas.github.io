
import React, { useState, useRef } from 'react';
import { 
  motion, 
  useAnimationFrame, 
  useMotionValue, 
  useTransform 
} from 'framer-motion';

const MotionDiv = motion.div as any;

const RhombusStar = () => (
  <MotionDiv 
    className="text-accent-lime mx-6 md:mx-10 relative flex items-center justify-center"
    animate={{ rotate: 360 }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  >
    {/* Enhanced Glow backing */}
    <div className="absolute inset-0 bg-accent-lime/40 blur-md rounded-full scale-150" />
    
    {/* Sharp Vector - Rhombus Star */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10 w-3 h-3 md:w-5 md:h-5">
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="currentColor"/>
    </svg>
  </MotionDiv>
);

export const ManifestBanner: React.FC<{ t?: any }> = ({ t }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const baseSpeed = 0.006; // Adjusted from 0.008 to be slightly slower as requested
  
  // Physics State
  const currentSpeed = useRef(1); 

  useAnimationFrame((time, delta) => {
    // Target speed: 0 when hovered (pause), 1.0 normal
    const targetSpeed = isHovered ? 0 : 1.0;
    
    // Smoothly interpolate current speed towards target (Lerp)
    currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;

    let moveBy = baseSpeed * (delta || 16) * currentSpeed.current;
    
    let newX = x.get() - moveBy;
    
    // Reset logic: seamless loop at -50%
    if (newX <= -50) { 
        newX = 0;
    }
    x.set(newX);
  });

  const xPercent = useTransform(x, (v) => `${v}%`);
  const text = t?.manifest || "MANIFEST HEARTFULNESS";

  // Content Block: 4 repetitions per block to ensure enough width before duplication
  const contentBlock = [...Array(4)].map((_, i) => (
    <div key={i} className="flex items-center shrink-0">
      <span 
        className={`
            text-6xl md:text-8xl font-serif italic text-white/10 select-none transition-all duration-700 whitespace-nowrap
            ${isHovered ? 'text-accent-lime/60 blur-[0px] scale-105' : ''}
        `}
      >
        {text}
      </span>
      <RhombusStar />
    </div>
  ));

  return (
    <div 
      className="w-full overflow-hidden py-6 md:py-10 border-y border-white/5 bg-black/[0.2] cursor-default select-none relative z-20 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MotionDiv 
        style={{ x: xPercent } as any}
        className="flex items-center w-fit will-change-transform"
      >
        <div className="flex items-center shrink-0">
            {contentBlock}
        </div>
        <div className="flex items-center shrink-0">
            {contentBlock}
        </div>
      </MotionDiv>
    </div>
  );
};
