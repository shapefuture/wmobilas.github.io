
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CloudEngine } from './CloudEngine';
import { BioSwarm } from './BioSwarm';

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionSpan = motion.span as any;
const MotionImg = motion.img as any;

interface InteractiveTitleProps {
    children: React.ReactNode;
    y: any;
    onClick: () => void;
    startReveal: boolean;
    className?: string;
    delay: number;
}

const InteractiveTitle: React.FC<InteractiveTitleProps> = ({ 
    children, 
    y, 
    onClick, 
    startReveal,
    className,
    delay
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(-500);
    const mouseY = useMotionValue(-500);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top } = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const handleMouseLeave = () => {
        mouseX.set(-500);
        mouseY.set(-500);
    };

    return (
        <MotionDiv
            ref={ref}
            style={{ y } as any}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={startReveal ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }}
            className={`relative group cursor-pointer select-none ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {/* 
                PREMIUM CINEMATIC SHADOW STACK
                We use 4 layers of drop-shadow to create a "pocket of legibility" 
                that looks like light wrapping around the letters, avoiding a muddy black box.
            */}
            <h1 className="text-white w-full text-center relative z-10 transition-opacity duration-500 
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] 
                drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] 
                drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                drop-shadow-[0_0_120px_rgba(0,0,0,0.4)]">
                {children}
            </h1>

            {/* Flashlight Reveal Layer */}
            <MotionH1 
                className="absolute inset-0 text-accent-lime z-20 w-full text-center pointer-events-none"
                style={{
                    WebkitMaskImage: useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    maskImage: useMotionTemplate`radial-gradient(150px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                }}
            >
                {children}
            </MotionH1>
        </MotionDiv>
    );
};

export const Hero: React.FC<{ t: any; startReveal?: boolean; onNameClick?: () => void; setLocale?: (e: React.MouseEvent) => void }> = ({ t, startReveal = true, onNameClick, setLocale }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 25, 
    damping: 35, 
    mass: 1.2
  });
  
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]); 
  const title1Y = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const title2Y = useTransform(smoothProgress, [0, 1], ["0%", "10%"]); 
  const metaOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const metaY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const xSpring = useSpring(mouseX, { stiffness: 15, damping: 45 }); 
  const ySpring = useSpring(mouseY, { stiffness: 15, damping: 45 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(((e.clientX / innerWidth) - 0.5) * -20); 
      mouseY.set(((e.clientY / innerHeight) - 0.5) * -20);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div id="home" ref={containerRef} className="relative h-[100dvh] min-h-[500px] w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      
      {/* Background - Integrated Atmosphere */}
      <MotionDiv 
        style={{ y: bgY, scale: 1.15, x: xSpring } as any} 
        className="absolute inset-0 z-0 will-change-transform"
      >
        <MotionImg 
          initial={{ opacity: 0, filter: "blur(60px) brightness(0.2)" }}
          animate={{ opacity: 1, filter: "blur(0px) brightness(0.85) contrast(1.1)" }} 
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: ySpring } as any} 
          src="https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/BACKG.jpg" 
          alt="" 
          className="w-full h-full object-cover relative z-[-1]" 
        />
        
        {/* Volumetric Clouds Engine (High Altitude) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
             <CloudEngine />
        </div>

        {/* Cinematic Grading Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-20 pointer-events-none" />
        
        {/* Horizon Light Leak - Subtle band of light to separate ground from sky */}
        <div className="absolute left-0 right-0 top-[60%] h-[20vh] bg-accent-lime/5 blur-[80px] z-15 pointer-events-none opacity-30" />
      </MotionDiv>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none select-none w-full px-6">
        <div className="text-center w-full flex flex-col items-center">
            
            <div className="relative z-10 w-full flex justify-center perspective-[2000px] pointer-events-auto">
                <InteractiveTitle 
                    y={title1Y} 
                    onClick={() => onNameClick?.()} 
                    startReveal={startReveal}
                    delay={1.2}
                    className="text-[18vw] md:text-[11vw] leading-[0.8] font-serif tracking-tighter w-full"
                >
                    VIKTOR
                </InteractiveTitle>
            </div>

            <div className="relative z-10 w-full flex justify-center perspective-[2000px] pointer-events-auto">
                <InteractiveTitle 
                    y={title2Y} 
                    onClick={() => onNameClick?.()} 
                    startReveal={startReveal}
                    delay={1.2}
                    className="text-[16vw] md:text-[10vw] leading-[0.8] font-serif tracking-tighter italic w-full"
                >
                    PERMINOV
                </InteractiveTitle>
            </div>

            <MotionDiv
                style={{ opacity: metaOpacity, y: metaY } as any}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={startReveal ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ delay: 1.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-40 mt-10 md:mt-12 pointer-events-auto flex flex-col items-center"
            >
                {/* Consciousness Evangelist Pill */}
                <MotionSpan 
                    className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-accent-lime drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center gap-3 justify-center bg-black/50 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 shadow-2xl relative z-20"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                     <span className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse shadow-[0_0_12px_#D4FF00] shrink-0" />
                     <span className="leading-none">{t.subtitle}</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-accent-lime animate-pulse shadow-[0_0_12px_#D4FF00] shrink-0" />
                </MotionSpan>
            </MotionDiv>
        </div>
      </div>

      {/* 
         BIO-SWARM (Butterflies & Fireflies) 
         Positioned absolutely at the bottom of the hero section, separate from the pill container.
         This allows for full-width distribution across the lower viewport.
      */}
      <motion.div 
         initial={{ opacity: 0 }}
         animate={startReveal ? { opacity: 1 } : { opacity: 0 }}
         transition={{ delay: 2.2, duration: 2 }}
         className="absolute bottom-0 left-0 right-0 h-[45vh] z-20 pointer-events-none"
      >
          <BioSwarm />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={startReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 md:bottom-12 left-0 right-0 z-40 flex justify-center pointer-events-none"
      >
        <MotionDiv
            style={{ opacity: metaOpacity }}
            animate={{ y: [0, 8, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            className="flex flex-col items-center"
        >
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
            <ChevronDown size={14} className="text-white/40 mt-1" />
        </MotionDiv>
      </motion.div>
    </div>
  );
};
