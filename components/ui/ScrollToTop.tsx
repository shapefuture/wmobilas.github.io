
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  
  // Magnetic Logic
  const position = { x: useMotionValue(0), y: useMotionValue(0) };
  const springX = useSpring(position.x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(position.y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    position.x.set(middleX * 0.5);
    position.y.set(middleY * 0.5);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  useEffect(() => {
    const toggleVisibility = () => {
      // Logic for desktop visibility
      if (window.innerWidth >= 768 && window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    window.addEventListener('resize', toggleVisibility);
    return () => {
        window.removeEventListener('scroll', toggleVisibility);
        window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-32 left-6 md:left-10 z-[80] hidden md:block"
        >
            <motion.button
                ref={ref}
                onClick={scrollToTop}
                onMouseMove={handleMouseMove}
                onMouseLeave={reset}
                style={{ x: springX, y: springY }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group hover:border-accent-lime/50 transition-colors duration-300"
            >
                <ChevronUp 
                    className="text-white/60 group-hover:text-accent-lime transition-colors duration-300" 
                    size={24} 
                />
            </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
