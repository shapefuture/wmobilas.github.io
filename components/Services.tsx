
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { Eye, Compass, Activity, Fingerprint, Cpu, Lightbulb, Quote } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { MagicalText } from './ui/MagicalText';

const MotionDiv = motion.div as any;

const ServiceCard: React.FC<{ 
    title: string; 
    description: string; 
    icon: React.ReactNode; 
    index: number;
    className?: string;
}> = ({ title, description, icon, index, className = "" }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationId: number;
        let time = 0;
        let width = 0;
        let height = 0;

        // Mobile Detection for Adaptive Contrast
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        // Boost opacity on mobile for visibility against glare
        const opacityBoost = isMobile ? 0.2 : 0;

        // --- ANIMATION KERNELS ---
        
        // 0. TREND FORECASTING: Matrix Rain
        const drawMatrix = () => {
            const fontSize = 12;
            const columns = Math.floor(width / 14);
            if (!(canvas as any).drops || (canvas as any).drops.length !== columns) {
                (canvas as any).drops = new Array(columns).fill(1);
            }
            const drops = (canvas as any).drops;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = isHovered ? '#D4FF00' : `rgba(255, 255, 255, ${0.25 + opacityBoost})`;
            ctx.font = `bold ${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                const x = i * 14;
                const y = drops[i] * 14;
                
                ctx.fillText(text, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        // 1. VISUAL COMMUNICATION: Sine Waves
        const drawWaves = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = isMobile ? 2 : 1.5;
            const lines = 8;
            const step = height / lines;
            
            for(let i=0; i<lines; i++) {
                ctx.beginPath();
                const yBase = i * step + step/2;
                const alpha = isHovered ? 0.3 + (i/lines)*0.4 : 0.1 + opacityBoost;
                ctx.strokeStyle = isHovered ? `rgba(212, 255, 0, ${alpha})` : `rgba(255, 255, 255, ${Math.min(1, alpha)})`;
                
                for(let x=0; x<width; x+=5) {
                    const frequency = 0.01 + (i * 0.002);
                    const amplitude = isHovered ? 20 : 5;
                    const phase = time * 0.05 + i;
                    const y = yBase + Math.sin(x * frequency + phase) * amplitude * Math.sin(time * 0.02 + x * 0.005);
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };

        // 2. FUTURE OF WORK: Connected Nodes
        const drawPlexus = () => {
            ctx.clearRect(0, 0, width, height);
            
            if (!(canvas as any).nodes) {
                const count = isMobile ? 15 : 25;
                (canvas as any).nodes = Array.from({length: count}, (_, i) => ({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    phase: Math.random() * Math.PI * 2
                }));
            }
            
            const nodes = (canvas as any).nodes;

            nodes.forEach((node: any) => {
                node.x += node.vx * (isHovered ? 2 : 1);
                node.y += node.vy * (isHovered ? 2 : 1);
                
                if(node.x < 0 || node.x > width) node.vx *= -1;
                if(node.y < 0 || node.y > height) node.vy *= -1;
                
                const pulse = Math.sin(time * 0.1 + node.phase) * 0.5 + 0.5;
                const baseAlpha = 0.15 + pulse * 0.15 + opacityBoost;
                ctx.fillStyle = isHovered ? `rgba(212, 255, 0, ${0.5 + pulse * 0.5})` : `rgba(255, 255, 255, ${baseAlpha})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, isHovered ? 2.5 : (isMobile ? 2 : 1.5), 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.strokeStyle = isHovered ? 'rgba(212, 255, 0, 0.2)' : `rgba(255, 255, 255, ${0.05 + opacityBoost})`;
            ctx.lineWidth = isMobile ? 1.5 : 1;

            for(let i=0; i<nodes.length; i++) {
                for(let j=i+1; j<nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 100) {
                        const distAlpha = (1 - (dist / 100));
                        ctx.globalAlpha = isMobile ? Math.min(1, distAlpha * 2) : distAlpha;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        };

        // 3. PROBLEM SOLVING: Circuitry
        const drawCircuitry = () => {
             ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
             ctx.fillRect(0, 0, width, height);
             
             if (!(canvas as any).crawlers) {
                 (canvas as any).crawlers = Array.from({length: isMobile ? 5 : 8}, () => ({
                     x: Math.floor(Math.random() * width / 10) * 10,
                     y: Math.floor(Math.random() * height / 10) * 10,
                     vx: Math.random() > 0.5 ? 2 : -2,
                     vy: 0,
                     color: Math.random() > 0.5 ? '#D4FF00' : '#FFFFFF',
                     life: Math.random() * 100
                 }));
             }
             
             const crawlers = (canvas as any).crawlers;
             
             crawlers.forEach((c: any) => {
                 ctx.beginPath();
                 ctx.strokeStyle = isHovered ? c.color : `rgba(255,255,255,${0.15 + opacityBoost})`;
                 ctx.lineWidth = isMobile ? 2.5 : 2;
                 ctx.moveTo(c.x, c.y);
                 
                 c.x += c.vx;
                 c.y += c.vy;
                 
                 ctx.lineTo(c.x, c.y);
                 ctx.stroke();
                 
                 if (Math.random() > 0.95) {
                     if (c.vx !== 0) {
                         c.vx = 0;
                         c.vy = Math.random() > 0.5 ? 2 : -2;
                     } else {
                         c.vy = 0;
                         c.vx = Math.random() > 0.5 ? 2 : -2;
                     }
                 }
                 
                 if (c.x < 0 || c.x > width || c.y < 0 || c.y > height || Math.random() > 0.99) {
                     c.x = Math.floor(Math.random() * width / 10) * 10;
                     c.y = Math.floor(Math.random() * height / 10) * 10;
                 }
             });
             
             if (isHovered) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
                for(let x=0; x<width; x+=20) {
                    for(let y=0; y<height; y+=20) {
                        ctx.fillRect(x,y,1,1);
                    }
                }
             }
        };

        // 4. SELF DISCOVERY: Orbital Mechanics
        const drawOrbit = () => {
            ctx.clearRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;
            const rings = 4;
            
            for(let i=0; i<rings; i++) {
                const r = 40 + (i * 25);
                const squish = 0.4 + (i * 0.1); 
                const rotation = (i * Math.PI) / rings; 
                
                ctx.beginPath();
                const alpha = isHovered ? (0.4 - i * 0.05) : (0.1 + opacityBoost);
                ctx.strokeStyle = isHovered ? `rgba(212, 255, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
                ctx.lineWidth = isMobile ? 1.5 : 1;
                ctx.ellipse(cx, cy, r, r * squish, rotation, 0, Math.PI * 2);
                ctx.stroke();
                
                const speed = 0.02 * (isHovered ? 2 : 1) * (i % 2 === 0 ? 1 : -1);
                const t = time * speed + (i * 100);
                
                const px = cx + r * Math.cos(t) * Math.cos(rotation) - r * squish * Math.sin(t) * Math.sin(rotation);
                const py = cy + r * Math.cos(t) * Math.sin(rotation) + r * squish * Math.sin(t) * Math.cos(rotation);
                
                ctx.fillStyle = isHovered ? '#D4FF00' : '#FFFFFF';
                if (isHovered) {
                    ctx.shadowColor = '#D4FF00';
                    ctx.shadowBlur = 10;
                }
                ctx.beginPath();
                ctx.arc(px, py, isHovered ? 3 : (isMobile ? 2.5 : 2), 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            
            ctx.fillStyle = isHovered ? '#FFFFFF' : `rgba(255,255,255,${0.2 + opacityBoost})`;
            ctx.beginPath();
            ctx.arc(cx, cy, isMobile ? 4 : 3, 0, Math.PI * 2);
            ctx.fill();
        };

        // 5. IDEA VALIDATION: Stealth Radar with Sparse Reveal
        const drawScanner = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; 
            ctx.fillRect(0, 0, width, height);
            
            if (!(canvas as any).ideas) {
                 const ideaCount = isMobile ? 12 : 20; 
                 (canvas as any).ideas = Array.from({length: ideaCount}, () => ({
                     x: Math.random() * width,
                     y: Math.random() * height,
                     size: Math.random() * 2 + 1
                 }));
            }
            const ideas = (canvas as any).ideas;
            const scanSpeed = isHovered ? 4 : 1;
            const scanX = (time * scanSpeed) % (width + 100);
            
            ideas.forEach((idea: any) => {
                const dist = Math.abs(idea.x - (scanX - 50));
                if (dist < 60) {
                     const intensity = 1 - (dist / 60);
                     ctx.fillStyle = `rgba(212, 255, 0, ${intensity})`;
                     ctx.shadowColor = '#D4FF00';
                     ctx.shadowBlur = intensity * 10;
                     ctx.beginPath();
                     ctx.arc(idea.x, idea.y, idea.size * (isMobile ? 1.5 : 1), 0, Math.PI * 2);
                     ctx.fill();
                     ctx.shadowBlur = 0;
                } 
            });

            const gradient = ctx.createLinearGradient(scanX - 50, 0, scanX, 0);
            gradient.addColorStop(0, 'rgba(212, 255, 0, 0)');
            const barAlpha = isHovered ? 0.3 : (0.1 + opacityBoost);
            gradient.addColorStop(1, isHovered ? `rgba(212, 255, 0, ${barAlpha})` : `rgba(255, 255, 255, ${barAlpha})`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(scanX - 60, 0, 60, height);
            ctx.fillStyle = isHovered ? '#D4FF00' : `rgba(255,255,255,${0.3 + opacityBoost})`;
            ctx.fillRect(scanX, 0, isMobile ? 2 : 1, height);
        };

        const draw = () => {
            time++;
            switch(index) {
                case 0: drawMatrix(); break;
                case 1: drawWaves(); break;
                case 2: drawPlexus(); break;
                case 3: drawCircuitry(); break;
                case 4: drawOrbit(); break;
                case 5: drawScanner(); break;
                default: drawMatrix(); break;
            }
            animationId = requestAnimationFrame(draw);
        };

        const resize = () => {
            if (canvas.parentElement) {
                const rect = canvas.parentElement.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;
                
                // Set logical dimensions (CSS pixels)
                width = rect.width;
                height = rect.height;
                
                // Set buffer dimensions (Physical pixels)
                canvas.width = width * dpr;
                canvas.height = height * dpr;
                
                // CRITICAL: Explicitly set CSS size to prevent canvas from expanding to buffer size
                canvas.style.width = `${width}px`;
                canvas.style.height = `${height}px`;
                
                // Scale context logic
                ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset
                ctx.scale(dpr, dpr);
                
                (canvas as any).drops = null;
                (canvas as any).nodes = null;
                (canvas as any).crawlers = null;
                (canvas as any).ideas = null;
            }
        };

        window.addEventListener('resize', resize);
        resize();
        draw();
        
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [isHovered, index]);

    return (
        <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative p-6 md:p-8 bg-surface/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col justify-between min-h-[260px] md:min-h-[300px] rounded-sm hover:border-accent-lime/50 transition-colors duration-500 ${className}`}
        >
            <canvas 
                ref={canvasRef} 
                className="absolute inset-0 z-0 opacity-40 md:opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" 
            />
            <div className="relative z-10">
                <div className="text-white/40 mb-4 md:mb-6 group-hover:text-accent-lime transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-3 group-hover:translate-x-1 transition-transform [text-wrap:balance]">
                    {title}
                </h3>
                <p className="text-[11px] md:text-sm text-secondary leading-relaxed group-hover:text-white/80 transition-colors [text-wrap:balance]">
                    {description}
                </p>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-lime group-hover:w-full transition-all duration-500 ease-out" />
        </MotionDiv>
    );
};

export const Services: React.FC<{ t: any }> = ({ t }) => {
  return (
    <Section id="services" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 relative">
             <MotionDiv 
                className="block text-accent-lime mb-6"
                animate={{ y: [-5, 5, -5], rotate: [-3, 3, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Quote size={28} className="mx-auto opacity-80" />
            </MotionDiv>
            <div className="text-xl md:text-4xl font-light leading-relaxed text-white italic font-serif [text-wrap:balance]">
                <MagicalText text={t.servicesQuote} delay={0.2} />
            </div>
        </div>

        <div className="mb-12">
            <Reveal delay={0.4}>
                <div className="inline-block px-3 py-1 border border-accent-lime/30 rounded-full text-accent-lime text-[9px] font-mono uppercase tracking-widest mb-4">
                    ( 03 — {t.whatIDo} )
                </div>
                <h2 className="text-3xl md:text-6xl font-serif text-white [text-wrap:balance]">{t.whatIDo}</h2>
            </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ServiceCard title={t.service1Title} description={t.service1Desc} icon={<Eye size={28} />} index={0} className="md:col-span-2" />
            <ServiceCard title={t.service2Title} description={t.service2Desc} icon={<Activity size={28} />} index={1} />
            <ServiceCard title={t.service3Title} description={t.service3Desc} icon={<Compass size={28} />} index={2} />
            <ServiceCard title={t.service4Title} description={t.service4Desc} icon={<Cpu size={28} />} index={3} className="md:col-span-2" />
            <ServiceCard title={t.service5Title} description={t.service5Desc} icon={<Fingerprint size={28} />} index={4} className="md:col-span-2" />
            <ServiceCard title={t.service6Title} description={t.service6Desc} icon={<Lightbulb size={28} />} index={5} />
        </div>
    </Section>
  );
};
