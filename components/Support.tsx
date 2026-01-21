
import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { Heart, ArrowUpRight } from 'lucide-react';

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
        <motion.div 
            ref={ref} 
            onMouseMove={handleMouse} 
            onMouseLeave={reset}
            style={{ x: springX, y: springY }}
            className="flex items-center justify-center"
        >
            {children}
        </motion.div>
    );
};

export const Support: React.FC<{ t: any }> = ({ t }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Section className="py-24 md:py-32 relative overflow-hidden">
      {/* Premium Background FX - Heartbeat Resonance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
         <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.05, 0.1, 0.05],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-[600px] h-[600px] bg-accent-lime/10 rounded-full blur-[100px]"
         />
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_70%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
         <div className="flex flex-col items-center">
             <Reveal width="100%">
                 <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-accent-lime/20 blur-xl rounded-full"
                        />
                        <Heart size={32} className="text-accent-lime relative z-10 fill-accent-lime/20" />
                    </div>
                 </div>
             </Reveal>

             <Reveal width="100%" delay={0.1}>
                 <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight [text-wrap:balance]">
                     {t.supportTitle}
                 </h2>
             </Reveal>

             <Reveal width="100%" delay={0.2}>
                 <p className="text-lg md:text-xl text-secondary font-light max-w-2xl mx-auto mb-12 leading-relaxed [text-wrap:balance]">
                     {t.supportDesc}
                 </p>
             </Reveal>

             <Reveal width="100%" delay={0.3}>
                 <Magnetic>
                    <a 
                        href="http://coindrop.to/shapefuture" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="relative group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-serif text-xl md:text-2xl transition-all duration-300 hover:scale-105"
                    >
                        {/* Glow effect on hover */}
                        <div className={`absolute -inset-4 bg-accent-lime/40 blur-xl rounded-full transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                        
                        <span className="relative z-10 italic tracking-wide">{t.supportButton}</span>
                        <div className="relative z-10 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-accent-lime group-hover:text-black transition-colors duration-300">
                             <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                    </a>
                 </Magnetic>
             </Reveal>
         </div>
      </div>
    </Section>
  );
};
