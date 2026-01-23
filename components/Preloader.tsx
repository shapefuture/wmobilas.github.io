
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface PreloaderProps {
  progress: number;
  onComplete: () => void;
  t: any;
}

export const Preloader: React.FC<PreloaderProps> = ({ progress, onComplete, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const exitRef = useRef(false);

  // Sync progress with internal ref for the animation loop
  useEffect(() => {
    progressRef.current = progress;
    if (progress === 100) exitRef.current = true;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let flashIntensity = 0;

    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 60 : 150;

    class Particle {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      size: number;
      color: string;
      originalSize: number;

      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        const angle = Math.random() * Math.PI * 2;
        const radius = initial ? 200 + Math.random() * 800 : 800 + Math.random() * 500;
        this.x = Math.cos(angle) * radius;
        this.y = Math.sin(angle) * radius;
        this.z = (Math.random() - 0.5) * 500;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.vz = (Math.random() - 0.5) * 1;
        this.originalSize = Math.random() * 2 + 0.5;
        this.size = this.originalSize;
        this.color = Math.random() > 0.8 ? '#D4FF00' : '#FFFFFF';
      }

      update(attraction: number, isImploding: boolean) {
        const dx = -this.x;
        const dy = -this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (isImploding) {
            const force = (5000 / (dist + 10)) * 0.5; 
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.x += this.vx;
            this.y += this.vy;
            if (dist < 100) {
                this.size = this.originalSize * (1 + (100-dist)/10);
            }
        } else {
            const force = attraction * 0.05;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            this.vx *= 0.95;
            this.vy *= 0.95;
            if (dist < 10) this.reset();
        }
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    const draw = () => {
      time += 0.02;
      const currentP = progressRef.current / 100;
      const isImploding = exitRef.current;
      
      const grd = ctx.createRadialGradient(
        window.innerWidth / 2, window.innerHeight / 2, 0,
        window.innerWidth / 2, window.innerHeight / 2, window.innerWidth
      );
      grd.addColorStop(0, '#0A0A0A');
      grd.addColorStop(1, '#000000');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.save();
      ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

      if (!isImploding || flashIntensity < 0.5) {
          const pulse = Math.sin(time * 3) * 5;
          const coreBase = isImploding ? 10 : (2 + (currentP * 40));
          const coreSize = Math.max(0, coreBase + pulse - (isImploding ? time * 10 : 0));
          
          ctx.shadowBlur = isImploding ? 100 : 40 * currentP;
          ctx.shadowColor = '#D4FF00';
          ctx.fillStyle = currentP > 0.9 ? '#D4FF00' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(0, coreSize), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
      }

      particles.forEach((p, i) => {
        p.update(currentP + 0.1, isImploding);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, (0.4 + (currentP * 0.6)) - flashIntensity);
        ctx.beginPath();
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (speed > 5) {
             const angle = Math.atan2(p.vy, p.vx);
             ctx.ellipse(p.x, p.y, p.size * 2, p.size * 0.5, angle, 0, Math.PI*2);
        } else {
             ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();

        if (!isImploding) {
            for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                ctx.strokeStyle = '#D4FF00';
                ctx.lineWidth = (1 - dist / 80) * 0.5;
                ctx.globalAlpha = (1 - dist / 80) * 0.2 * currentP;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
            }
        }
      });

      ctx.restore();

      if (isImploding) {
          flashIntensity += 0.05;
          if (flashIntensity > 0) {
              ctx.fillStyle = '#D4FF00';
              ctx.globalAlpha = flashIntensity * flashIntensity;
              ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
              ctx.fillStyle = '#FFFFFF';
              ctx.globalAlpha = Math.max(0, (flashIntensity - 0.5) * 2);
              ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
          }
      }
      
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <MotionDiv
      ref={containerRef}
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 0.5, ease: "linear" }
      }}
      className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden flex flex-col items-center justify-center cursor-wait"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
    </MotionDiv>
  );
};
