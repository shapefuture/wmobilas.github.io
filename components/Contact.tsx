
import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { ArrowUpRight, Radio } from 'lucide-react';

const MotionDiv = motion.div as any;

const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };
    
    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        position.x.set(middleX * 0.3);
        position.y.set(middleY * 0.3);
    };

    const reset = () => {
        position.x.set(0);
        position.y.set(0);
    };

    const { x, y } = position;
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    return (
        <MotionDiv 
            ref={ref} 
            onMouseMove={handleMouse} 
            onMouseLeave={reset}
            style={{ x: springX, y: springY } as any}
            className="flex items-center justify-center"
        >
            {children}
        </MotionDiv>
    );
};

export const Contact: React.FC<{ t: any }> = ({ t }) => {
  return (
    <Section id="contact" className="py-24 md:py-48 relative overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none"
        style={{
            backgroundImage: `
                linear-gradient(to right, rgba(212, 255, 0, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(212, 255, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '3rem 3rem',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="absolute w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-accent-lime/5 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Centered Top Part */}
        <Reveal width="100%" className="text-center">
            <div className="flex flex-col items-center">
                <div className="inline-flex items-center gap-2 mb-6 md:mb-8 text-accent-lime text-[9px] md:text-xs font-mono uppercase tracking-widest border border-accent-lime/30 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md">
                    <Radio size={12} className="animate-pulse" />
                    ( 04 — {t.officeHoursTitle} )
                </div>
                
                <h3 className="text-3xl md:text-6xl font-serif text-white mb-8 leading-tight max-w-3xl [text-wrap:balance] text-center whitespace-pre-line">
                    {t.officeHoursDesc}
                </h3>
            </div>
        </Reveal>

        <div className="mt-10 md:mt-16 flex justify-center w-full">
            <Magnetic>
                <a 
                    href="https://calendly.com/shapefuture/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col items-center justify-center w-64 h-24 md:w-80 md:h-32 rounded-[1.5rem] md:rounded-[2rem] bg-[#111] border border-white/10 overflow-hidden transition-colors duration-500 hover:border-accent-lime/50 shadow-2xl"
                >
                    {/* Background fill - slower transition for premium feel */}
                    <div className="absolute inset-0 bg-accent-lime translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]" />
                    
                    <div className="relative z-10 flex flex-col items-center justify-center w-full">
                        {/* Text: Color transition is faster (150ms) than background (700ms) to satisfy "text black before button lime" */}
                        <div className="flex items-center justify-center text-white group-hover:text-black transition-colors duration-150 ease-out">
                            <div className="flex items-center gap-2 relative">
                                <span className="text-lg md:text-2xl font-serif italic leading-none whitespace-nowrap">
                                    {t.bookNow}
                                </span>
                                {/* Arrow: Now integrated into the centered flex group to avoid sticking to right edge */}
                                <div className="w-0 group-hover:w-6 transition-all duration-500 ease-[0.16,1,0.3,1] overflow-hidden flex items-center justify-center opacity-0 group-hover:opacity-100">
                                     <ArrowUpRight size={22} className="shrink-0 group-hover:rotate-45 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                        <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover:text-black/50 transition-colors duration-150 mt-2 block">
                            {t.limited}
                        </span>
                    </div>
                </a>
            </Magnetic>
        </div>
      </div>
    </Section>
  );
};
