
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

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
        <motion.div
            ref={ref}
            style={{ y }}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            animate={startReveal ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay }}
            className={`relative group cursor-pointer select-none ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <h1 className="text-white mix-blend-difference w-full text-center relative z-10 transition-opacity duration-500">
                {children}
            </h1>

            <motion.h1 
                className="absolute inset-0 text-accent-lime z-20 w-full text-center pointer-events-none"
                style={{
                    WebkitMaskImage: useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                    maskImage: useMotionTemplate`radial-gradient(100px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
                }}
            >
                {children}
            </motion.h1>
        </motion.div>
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
      
      {/* Background - Enhanced Parallax */}
      <motion.div 
        style={{ y: bgY, scale: 1.15, x: xSpring }} 
        className="absolute inset-0 z-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-black/40 z-10" /> 
        <motion.img 
          initial={{ opacity: 0, filter: "blur(60px) brightness(0.3)" }}
          animate={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
          transition={{ duration: 4, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: ySpring }} 
          src="https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/BACK.jpg" 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none select-none w-full px-6">
        
        <motion.div
            initial={{ opacity: 0 }}
            animate={startReveal ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0 }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-visible"
        >
            <div
                className="absolute w-[120vw] h-[120vh] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    maskImage: "radial-gradient(circle at center, black 0%, transparent 40%)",
                    WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 40%)",
                }}
            />
        </motion.div>

        <div className="text-center w-full flex flex-col items-center relative z-10">
            
            <div className="relative z-10 w-full flex justify-center perspective-[2000px] pointer-events-auto">
                <InteractiveTitle 
                    y={title1Y} 
                    onClick={() => onNameClick?.()} 
                    startReveal={startReveal}
                    delay={1.2}
                    className="text-[20vw] md:text-[11vw] leading-[0.8] font-serif tracking-tighter w-full"
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
                    className="text-[18vw] md:text-[10vw] leading-[0.8] font-serif tracking-tighter italic w-full"
                >
                    PERMINOV
                </InteractiveTitle>
            </div>

            <motion.div
                style={{ opacity: metaOpacity, y: metaY }}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={startReveal ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                transition={{ delay: 1.8, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-30 mt-6 md:mt-8 pointer-events-auto"
            >
                <motion.span 
                    className="font-mono text-[9px] md:text-xs uppercase tracking-[0.3em] text-accent-lime drop-shadow-sm flex items-center gap-3 justify-center"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                     <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent-lime animate-pulse shadow-[0_0_10px_#D4FF00] shrink-0" />
                     <span className="leading-none">{t.subtitle}</span>
                     <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-accent-lime animate-pulse shadow-[0_0_10px_#D4FF00] shrink-0" />
                </motion.span>
            </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Unified Center Axis */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={startReveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 md:bottom-12 left-0 right-0 z-30 flex justify-center pointer-events-none"
      >
        <motion.div
            style={{ opacity: metaOpacity }}
            animate={{ y: [0, 8, 0] }}
            transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
            className="flex flex-col items-center"
        >
            {/* The vertical stroke and chevron are now strictly centered in this flex column */}
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
            <ChevronDown size={14} className="text-white/40 mt-1" />
        </motion.div>
      </motion.div>
    </div>
  );
};
