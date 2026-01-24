import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const BASE_URL = "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/";

const ASSETS = [
  `${BASE_URL}_BACKG.jpg`,
  `${BASE_URL}_personal_photo.jpg`,
  `${BASE_URL}_COCREATIVE.jpg`,
  `${BASE_URL}_MAGNUS.jpg`,
  `${BASE_URL}_UNI.jpg`,
  // Floating Craft Assets
  `${BASE_URL}baloon_large.png`,
  `${BASE_URL}baloon_large2.png`,
  `${BASE_URL}baloon_medium.png`,
  `${BASE_URL}baloon_small.png`,
  `${BASE_URL}ship_back.png`,
  `${BASE_URL}ship_far.png`,
  `${BASE_URL}ship_front.png`,
  `${BASE_URL}ship_very_far.png`
];

interface PreloaderProps {
  onComplete: () => void;
  t: any;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete, t }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const exitRef = useRef(false);
  const hasTriggeredComplete = useRef(false);

  // --- ASSET LOADING ---
  useEffect(() => {
    let mounted = true;
    let loadedCount = 0;
    const totalAssets = ASSETS.length;
    
    // Safety Timeout
    const safetyTimeout = setTimeout(() => {
        if (mounted && progressRef.current < 100) {
            setProgress(100);
            progressRef.current = 100;
        }
    }, 8000); // Increased for more assets

    const updateProgress = () => {
        if (!mounted) return;
        loadedCount++;
        const val = Math.round((loadedCount / totalAssets) * 100);
        setProgress(val);
        progressRef.current = val;
        
        if (loadedCount === totalAssets) {
             clearTimeout(safetyTimeout);
        }
    };

    ASSETS.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = updateProgress;
        img.onerror = updateProgress;
    });

    return () => { mounted = false; clearTimeout(safetyTimeout); };
  }, []);

  // --- PHYSICS ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let flashIntensity = 0;

    const particles: Particle[] = [];
    const particleCount = window.innerWidth < 768 ? 80 : 200;

    class Particle {
      x: number; y: number; z: number;
      vx: number; vy: number; vz: number;
      size: number;
      color: string;
      originalSize: number;

      constructor() {
        this.x = 0; this.y = 0; this.z = 0;
        this.vx = 0; this.vy = 0; this.vz = 0;
        this.size = 0; this.color = '#fff';
        this.originalSize = 0;
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
            // SINGULARITY PHYSICS
            const force = (5000 / (dist + 10)) * 0.8; 
            
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            
            this.vx *= 0.96;
            this.vy *= 0.96;
            
            this.x += this.vx;
            this.y += this.vy;
            
            if (dist < 150) {
                this.size = this.originalSize * (1 + (150-dist)/20);
                this.color = '#FFFFFF';
            }
        } else {
            // ORBITAL PHYSICS
            const force = attraction * 0.05;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            
            this.vx *= 0.95;
            this.vy *= 0.95;
            
            if (dist < 20) this.reset();
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
      if (hasTriggeredComplete.current) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
          return; 
      }

      time += 0.02;
      
      if (progressRef.current === 100 && !exitRef.current) {
          exitRef.current = true;
      }
      
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

      // Core Star
      if (!isImploding || flashIntensity < 0.8) {
          const pulse = Math.sin(time * 3) * 5;
          let coreRadius = 2 + (currentP * 40);

          if (isImploding) {
              coreRadius = Math.max(0, 42 * (1 - flashIntensity * 1.5)); 
          }

          const coreSize = Math.max(0, coreRadius + (isImploding ? 0 : pulse));
          
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
        
        const flashDampen = Math.max(0, 1 - flashIntensity * 1.5);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, (0.4 + (currentP * 0.6))) * flashDampen;
        
        ctx.beginPath();
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        
        if (speed > 5) {
             const angle = Math.atan2(p.vy, p.vx);
             ctx.ellipse(p.x, p.y, p.size * (1 + speed/10), p.size * 0.5, angle, 0, Math.PI*2);
        } else {
             ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();

        if (!isImploding && flashDampen > 0) {
            for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx * dx + dy * dy;
                if (distSq < 6400) { 
                    ctx.strokeStyle = '#D4FF00';
                    ctx.lineWidth = (1 - distSq / 6400) * 0.5;
                    ctx.globalAlpha = (1 - distSq / 6400) * 0.15 * currentP * flashDampen;
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
          flashIntensity += 0.04;
          
          if (flashIntensity > 0) {
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              const maxRadius = Math.max(window.innerWidth, window.innerHeight);

              if (flashIntensity < 1.2) {
                  const limeAlpha = Math.sin(Math.min(1, flashIntensity) * Math.PI) * 1.0;
                  const gradLime = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
                  gradLime.addColorStop(0, `rgba(212, 255, 0, ${limeAlpha})`);
                  gradLime.addColorStop(1, `rgba(212, 255, 0, 0)`);
                  ctx.fillStyle = gradLime;
                  ctx.globalAlpha = 1;
                  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
              }

              const whiteAlpha = Math.max(0, (flashIntensity - 0.2) * 1.2); 
              if (whiteAlpha > 0) {
                  const gradWhite = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
                  gradWhite.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, whiteAlpha)})`);
                  gradWhite.addColorStop(0.7, `rgba(255, 255, 255, ${Math.min(1, whiteAlpha * 0.9)})`);
                  gradWhite.addColorStop(1, `rgba(255, 255, 255, 0)`);
                  
                  if (whiteAlpha >= 0.95) {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.globalAlpha = Math.min(1, (whiteAlpha - 0.95) * 20);
                    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
                  }

                  ctx.fillStyle = gradWhite;
                  ctx.globalAlpha = 1;
                  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
              }
              
              if (whiteAlpha >= 1.0 && !hasTriggeredComplete.current) {
                  hasTriggeredComplete.current = true;
                  onComplete(); 
              }
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
    <motion.div
      ref={containerRef}
      exit={{ 
        opacity: 0,
        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 z-[9999] bg-[#050505] overflow-hidden flex flex-col items-center justify-center cursor-wait"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
    </motion.div>
  );
};