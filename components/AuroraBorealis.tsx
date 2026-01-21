
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useVelocity, useSpring } from 'framer-motion';

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    /**
     * SIGGRAPH PREMIUM PALETTE - 13 Hyper-Saturated Hues
     * Carefully balanced lightness to prevent additive washout while maintaining neon intensity.
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
      
      // FIX: Dampen the velocity contribution significantly to prevent "jumping"
      // Base speed is slightly reduced (0.03) and scroll boost is capped (0.04 max)
      const scrollBoost = Math.min(Math.abs(velocity) * 0.0001, 0.04);
      time += 0.03 + scrollBoost;
      
      const w = window.innerWidth;
      const h = window.innerHeight * 0.7; // Taller render area for more vertical presence

      ctx.clearRect(0, 0, w, h);

      // We use Source-Over but increase the layer count to 8 for rich volumetric depth
      ctx.globalCompositeOperation = 'source-over';

      const rayWidth = 6;
      const numRays = Math.ceil(w / rayWidth);
      
      // Increased to 8 layers for complex overlapping curtains
      for (let layer = 0; layer < 8; layer++) {
          const color = PALETTE[layer % PALETTE.length];
          // Each layer has varying frequency and significantly higher speed for kinetic energy
          const freq = 0.003 - (layer * 0.0004);
          const layerSpeed = (layer + 1) * 1.5; // Multiplier for distinct phase speeds
          const offset = layer * 5000;

          for (let i = 0; i < numRays; i++) {
              const x = i * rayWidth;
              
              // Vertical Ray-Casting Noise Logic
              // High-frequency interference for that "shimmering curtain" look
              const noise = 
                  Math.sin(x * freq + time * (layerSpeed * 0.2) + offset) * 1.0 +
                  Math.sin(x * (freq * 2.8) - time * (layerSpeed * 0.15)) * 0.6 +
                  Math.cos(x * 0.01 + time * 0.5) * 0.2; // High speed shimmer
              
              // Normalize noise to 0-1 range
              const n = Math.max(0, (noise + 1.8) / 3.6);
              
              // Threshold for ray definition
              if (n > 0.35) {
                   const heightMap = n * h;
                   
                   // Exponential alpha falloff for sharp ray cores
                   const alpha = Math.pow(n, 4) * (0.25 / (layer * 0.5 + 1)); 

                   // Gradient with soft transitions
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
      // Fix: Correct variable name from animationId to animationFrameId
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, smoothVelocity]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="fixed top-0 left-0 right-0 z-[40] pointer-events-none h-[40vh]"
          style={{
             // plus-lighter for additive holographic color mixing
             mixBlendMode: 'plus-lighter',
             // Vertical mask for seamless bleed into the content
             maskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)',
             WebkitMaskImage: 'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.8) 40%, transparent 100%)'
          }}
        >
          <canvas 
            ref={canvasRef} 
            className="w-full h-full filter blur-[10px] saturate-[1.5] brightness-[1.2]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
