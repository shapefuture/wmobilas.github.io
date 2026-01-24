
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring } from 'framer-motion';

const MotionDiv = motion.div as any;

export const AuroraBorealis: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      // PERF: Downscale resolution by 0.5x for performance, rely on CSS scaling/blur for visual quality
      const dpr = 0.5 * (window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    /**
     * SIGGRAPH PREMIUM PALETTE - 13 Hyper-Saturated Hues
     */
    const PALETTE = [
        { h: 142, s: 95, l: 55 },  // Hyper Green
        { h: 175, s: 100, l: 50 }, // Cyan Ray
        { h: 260, s: 90, l: 60 },  // Electric Purple
        { h: 210, s: 100, l: 55 }, // Deep Electric Blue
        { h: 300, s: 95, l: 50 },  // Plasma Magenta
        { h: 330, s: 100, l: 60 }, // Hot Pink
        { h: 25, s: 100, l: 55 },  // Kinetic Orange
        { h: 50, s: 100, l: 50 },  // Solar Flare Yellow
        { h: 280, s: 85, l: 55 },  // Deep Indigo
        { h: 160, s: 100, l: 45 }, // Emerald Nebula
        { h: 190, s: 90, l: 50 },  // Arctic Sky
        { h: 270, s: 95, l: 65 },  // Soft Lavender
        { h: 10, s: 100, l: 50 },  // Crimson Aurora
    ];

    const draw = () => {
      const velocity = smoothVelocity.get();
      const scrollBoost = Math.min(Math.abs(velocity) * 0.0001, 0.04);
      time += 0.03 + scrollBoost;
      
      // Use logical dimensions for clearing since we scaled the context
      const w = window.innerWidth;
      const h = window.innerHeight * 0.7;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';

      // Increased ray width to compensate for lower resolution
      const rayWidth = 12; 
      const numRays = Math.ceil(w / rayWidth);
      
      // Reduced layers slightly for performance
      for (let layer = 0; layer < 6; layer++) {
          const color = PALETTE[layer % PALETTE.length];
          const freq = 0.003 - (layer * 0.0004);
          const layerSpeed = (layer + 1) * 1.5; 
          const offset = layer * 5000;

          for (let i = 0; i < numRays; i++) {
              const x = i * rayWidth;
              
              const noise = 
                  Math.sin(x * freq + time * (layerSpeed * 0.2) + offset) * 1.0 +
                  Math.sin(x * (freq * 2.8) - time * (layerSpeed * 0.15)) * 0.6 +
                  Math.cos(x * 0.01 + time * 0.5) * 0.2; 
              
              const n = Math.max(0, (noise + 1.8) / 3.6);
              
              if (n > 0.35) {
                   const heightMap = n * h;
                   const alpha = Math.pow(n, 4) * (0.25 / (layer * 0.5 + 1)); 

                   const grad = ctx.createLinearGradient(x, 0, x, heightMap);
                   grad.addColorStop(0, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
                   grad.addColorStop(0.15, `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`);
                   grad.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
                   
                   ctx.fillStyle = grad;
                   ctx.fillRect(x, 0, rayWidth, heightMap);
              }
          }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, smoothVelocity]);

  return (
    <AnimatePresence>
      {active && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="fixed top-0 left-0 right-0 z-[40] pointer-events-none h-[40vh]"
          style={{
             mixBlendMode: 'plus-lighter',
             maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)',
             WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)'
          }}
        >
          {/* Upscale the low-res canvas via CSS to smooth out pixels */}
          <canvas 
            ref={canvasRef} 
            className="w-full h-full filter blur-[10px] saturate-[1.5] brightness-[1.2]"
            style={{ width: '100%', height: '100%' }}
          />
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};
