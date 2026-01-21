
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  className?: string;
  blurStrength?: number;
  fullHeight?: boolean;
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  width = "fit-content", 
  delay = 0, 
  className = "",
  blurStrength = 12,
  fullHeight = false
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div 
      ref={ref} 
      style={{ 
        width, 
        height: fullHeight ? "100%" : "auto" 
      }} 
      className={`relative ${className}`}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30, filter: `blur(${blurStrength}px)` },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: fullHeight ? "100%" : "auto" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
