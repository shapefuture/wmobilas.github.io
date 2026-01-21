import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export const Footer: React.FC<{ t: any }> = ({ t }) => {
  const [time, setTime] = useState(new Date());
  
  // Flashlight Effect Refs
  const textRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
     if (!textRef.current) return;
     const { left, top } = textRef.current.getBoundingClientRect();
     mouseX.set(e.clientX - left);
     mouseY.set(e.clientY - top);
  };

  return (
    <footer className="py-6 border-t border-white/5 bg-black z-50 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-white/40">
          
          {/* Left: Copyright */}
          <div className="flex items-center gap-4 justify-self-center md:justify-self-start">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
             <span>&copy; {time.getFullYear()} Viktor Perminov</span>
          </div>

          {/* Center: Manifest Heartfulness with Flashlight Physics */}
          <div 
             className="hidden md:flex justify-self-center cursor-default relative group"
             onMouseMove={handleMouseMove}
             ref={textRef}
          >
             {/* 1. Base Layer (Dim/White-ish) - Not colored by default */}
             <span className="font-serif italic text-xl tracking-wider text-white/30 select-none transition-colors duration-500">
                {t.footerQuote}
             </span>
             
             {/* 2. Flashlight Layer (Bright Green) with Mask - Only reveals on hover */}
             <motion.span 
                className="absolute inset-0 font-serif italic text-xl tracking-wider text-accent-lime select-none pointer-events-none"
                style={{
                    WebkitMaskImage: useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    maskImage: useMotionTemplate`radial-gradient(120px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                }}
             >
                {t.footerQuote}
             </motion.span>
          </div>

          {/* Right: Time */}
          <div className="justify-self-center md:justify-self-end flex items-center gap-2">
             <span className="text-accent-lime tabular-nums">
                UTC {time.getUTCHours().toString().padStart(2, '0')}:{time.getUTCMinutes().toString().padStart(2, '0')}:{time.getUTCSeconds().toString().padStart(2, '0')}
             </span>
          </div>

        </div>
      </div>
    </footer>
  );
};