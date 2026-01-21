
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { Eye, Compass, Activity, Fingerprint, Cpu, Lightbulb, Quote } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { MagicalText } from './ui/MagicalText';

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
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        // --- ANIMATION KERNELS ---
        
        const drawMatrix = () => {
            const columns = Math.floor(canvas.width / 14);
            if (!(canvas as any).drops) {
                (canvas as any).drops = new Array(columns).fill(1);
            }
            const drops = (canvas as any).drops;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = isHovered ? '#D4FF00' : 'rgba(255, 255, 255, 0.15)';
            ctx.font = '10px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                const x = i * 14;
                const y = drops[i] * 14;
                ctx.fillText(text, x, y);
                if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        };

        const drawWaves = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 1;
            const lines = 6;
            const step = canvas.height / lines;
            for(let i=0; i<lines; i++) {
                ctx.beginPath();
                const yBase = i * step + step/2;
                const alpha = isHovered ? 0.3 + (i/lines)*0.4 : 0.05;
                ctx.strokeStyle = isHovered ? `rgba(212, 255, 0, ${alpha})` : 'rgba(255, 255, 255, 0.05)';
                for(let x=0; x<canvas.width; x+=10) {
                    const frequency = 0.01 + (i * 0.002);
                    const amplitude = isHovered ? 15 : 4;
                    const phase = time * 0.05 + i;
                    const y = yBase + Math.sin(x * frequency + phase) * amplitude;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        };

        const drawPlexus = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!(canvas as any).nodes) {
                const count = 15;
                (canvas as any).nodes = Array.from({length: count}, () => ({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    phase: Math.random() * Math.PI * 2
                }));
            }
            const nodes = (canvas as any).nodes;
            nodes.forEach((node: any) => {
                node.x += node.vx * (isHovered ? 2 : 1);
                node.y += node.vy * (isHovered ? 2 : 1);
                if(node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if(node.y < 0 || node.y > canvas.height) node.vy *= -1;
                ctx.fillStyle = isHovered ? `rgba(212, 255, 0, 0.4)` : `rgba(255, 255, 255, 0.1)`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.strokeStyle = isHovered ? 'rgba(212, 255, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)';
            for(let i=0; i<nodes.length; i++) {
                for(let j=i+1; j<nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if(dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const drawCircuitry = () => {
             ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             if (!(canvas as any).crawlers) {
                 (canvas as any).crawlers = Array.from({length: 5}, () => ({
                     x: Math.floor(Math.random() * canvas.width / 10) * 10,
                     y: Math.floor(Math.random() * canvas.height / 10) * 10,
                     vx: Math.random() > 0.5 ? 2 : -2,
                     vy: 0,
                     color: '#D4FF00',
                 }));
             }
             const crawlers = (canvas as any).crawlers;
             crawlers.forEach((c: any) => {
                 ctx.beginPath();
                 ctx.strokeStyle = isHovered ? c.color : 'rgba(255,255,255,0.05)';
                 ctx.moveTo(c.x, c.y);
                 c.x += c.vx; c.y += c.vy;
                 ctx.lineTo(c.x, c.y);
                 ctx.stroke();
                 if (Math.random() > 0.95) {
                     if (c.vx !== 0) { c.vx = 0; c.vy = Math.random() > 0.5 ? 2 : -2; } 
                     else { c.vy = 0; c.vx = Math.random() > 0.5 ? 2 : -2; }
                 }
                 if (c.x < 0 || c.x > canvas.width || c.y < 0 || c.y > canvas.height) {
                     c.x = Math.floor(Math.random() * canvas.width / 10) * 10;
                     c.y = Math.floor(Math.random() * canvas.height / 10) * 10;
                 }
             });
        };

        const drawOrbit = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const cx = canvas.width / 2; const cy = canvas.height / 2;
            for(let i=0; i<3; i++) {
                const r = 30 + (i * 20);
                ctx.beginPath();
                ctx.strokeStyle = isHovered ? `rgba(212, 255, 0, 0.2)` : 'rgba(255, 255, 255, 0.05)';
                ctx.ellipse(cx, cy, r, r * 0.5, i * Math.PI/3, 0, Math.PI * 2);
                ctx.stroke();
                const t = time * 0.02 + i;
                const px = cx + r * Math.cos(t);
                const py = cy + r * 0.5 * Math.sin(t);
                ctx.fillStyle = isHovered ? '#D4FF00' : '#FFFFFF';
                ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
            }
        };

        const drawScanner = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            const scanX = (time * 2) % (canvas.width + 50);
            ctx.fillStyle = isHovered ? 'rgba(212, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.03)';
            ctx.fillRect(scanX - 30, 0, 30, canvas.height);
            ctx.fillStyle = isHovered ? '#D4FF00' : 'rgba(255,255,255,0.1)';
            ctx.fillRect(scanX, 0, 1, canvas.height);
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
            }
            animationId = requestAnimationFrame(draw);
        };

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect) {
                canvas.width = rect.width;
                canvas.height = rect.height;
            }
        };
        resize();
        window.addEventListener('resize', resize);
        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, [isHovered, index]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative p-6 md:p-8 bg-surface/40 backdrop-blur-sm border border-white/10 overflow-hidden flex flex-col justify-between min-h-[260px] md:min-h-[300px] rounded-sm hover:border-accent-lime/50 transition-colors duration-500 ${className}`}
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
            <div className="relative z-10">
                <div className="text-white/40 mb-4 md:mb-6 group-hover:text-accent-lime transition-colors duration-300">
                    {icon}
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white mb-2 md:mb-3 group-hover:translate-x-1 transition-transform">
                    {title}
                </h3>
                <p className="text-[11px] md:text-sm text-secondary leading-relaxed group-hover:text-white/80 transition-colors">
                    {description}
                </p>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-lime group-hover:w-full transition-all duration-500 ease-out" />
        </motion.div>
    );
};

export const Services: React.FC<{ t: any }> = ({ t }) => {
  return (
    <Section id="services" className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-24 relative">
             <motion.div 
                className="block text-accent-lime mb-6"
                animate={{ y: [-5, 5, -5], rotate: [-3, 3, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Quote size={28} className="mx-auto opacity-80" />
            </motion.div>
            <div className="text-xl md:text-4xl font-light leading-relaxed text-white italic font-serif">
                <MagicalText text={t.servicesQuote} delay={0.2} />
            </div>
        </div>

        <div className="mb-12">
            <Reveal delay={0.4}>
                <div className="inline-block px-3 py-1 border border-accent-lime/30 rounded-full text-accent-lime text-[9px] font-mono uppercase tracking-widest mb-4">
                    ( 03 — {t.whatIDo} )
                </div>
                <h2 className="text-3xl md:text-6xl font-serif text-white">{t.whatIDo}</h2>
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
