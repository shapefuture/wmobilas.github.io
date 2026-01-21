
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { Send } from 'lucide-react';

export const Newsletter: React.FC<{ t?: any }> = ({ t }) => {
    const [email, setEmail] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // --- WARP SPEED ANIMATION ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let stars: Star[] = [];
        let animationFrameId: number;
        
        const resize = () => {
            if (containerRef.current) {
                canvas.width = containerRef.current.offsetWidth;
                canvas.height = containerRef.current.offsetHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        class Star {
            x: number;
            y: number;
            z: number;
            
            constructor() {
                this.x = (Math.random() - 0.5) * canvas!.width * 2;
                this.y = (Math.random() - 0.5) * canvas!.height * 2;
                this.z = Math.random() * 2000; // Depth
            }

            update(speed: number) {
                this.z -= speed;
                if (this.z <= 1) {
                    this.z = 2000;
                    this.x = (Math.random() - 0.5) * canvas!.width * 2;
                    this.y = (Math.random() - 0.5) * canvas!.height * 2;
                }
            }

            draw() {
                if (!ctx) return;
                
                const cx = canvas!.width / 2;
                const cy = canvas!.height / 2;
                
                // Perspective projection
                const sx = (this.x / this.z) * 500 + cx;
                const sy = (this.y / this.z) * 500 + cy;
                
                const radius = Math.max(0.1, (1 - this.z / 2000) * 3);
                
                // Opacity based on depth
                const opacity = 1 - this.z / 2000;

                ctx.beginPath();
                ctx.fillStyle = `rgba(212, 255, 0, ${opacity})`; // Lime green stars
                ctx.arc(sx, sy, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Trail effect when hovering (speed lines)
                if (isHovering) {
                     ctx.beginPath();
                     ctx.strokeStyle = `rgba(212, 255, 0, ${opacity * 0.5})`;
                     ctx.lineWidth = radius;
                     ctx.moveTo(sx, sy);
                     // Calculate previous position roughly
                     const prevSx = (this.x / (this.z + 50)) * 500 + cx;
                     const prevSy = (this.y / (this.z + 50)) * 500 + cy;
                     ctx.lineTo(prevSx, prevSy);
                     ctx.stroke();
                }
            }
        }

        const initStars = () => {
            stars = [];
            for(let i = 0; i < 400; i++) {
                stars.push(new Star());
            }
        };

        initStars();

        const animate = () => {
            // Clear with slight trail for motion blur feeling
            ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Speed control
            const speed = isHovering ? 40 : 2;

            stars.forEach(star => {
                star.update(speed);
                star.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovering]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.open(`https://chilipepper.io/form/melting-diced-fresno-60654af9-39e7-4334-980f-1973327e7243`, '_blank');
    };

    const MotionDiv = motion.div as any;

  return (
    <Section className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto text-center" ref={containerRef}>
        <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative rounded-3xl p-8 md:p-16 overflow-hidden border border-white/10 hover:border-accent-lime/50 transition-colors duration-700"
        >
            {/* Canvas Background */}
            <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60 mix-blend-screen pointer-events-none" />
            
            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10">
                <div className="inline-block px-3 py-1 border border-accent-lime/30 rounded-full text-accent-lime text-[10px] font-mono uppercase tracking-widest mb-6 backdrop-blur-md bg-black/50">
                    /// {t?.newsletterTitle || "DIGITAL_DOSSIER"}
                </div>
                
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-xl [text-wrap:balance]">{t?.newsletterSubtitle || "Transmission Inlet"}</h2>
                <p className="text-secondary mb-10 text-lg font-light max-w-lg mx-auto leading-relaxed [text-wrap:balance]">
                    {t?.newsletterDesc} 
                    <br />
                    {t?.newsletterJoin}
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative group/form">
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-lime to-purple-600 rounded-full opacity-0 group-hover/form:opacity-50 blur-lg transition duration-500" />
                    <input 
                        type="email" 
                        placeholder={t?.newsletterPlaceholder || "email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="relative flex-1 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-accent-lime transition-colors font-mono text-sm z-10"
                    />
                    <button 
                        type="submit"
                        className="relative bg-white text-black rounded-full px-8 py-4 font-bold font-mono tracking-widest hover:bg-accent-lime transition-colors flex items-center justify-center gap-2 z-10 text-sm leading-none"
                    >
                        <span>{t?.newsletterButton || "SUBSCRIBE"}</span> 
                        {/* Adjusted icon size to 14 to match text-sm (14px) and removed extra spacing issues */}
                        <Send size={14} className="stroke-[2.5px]" />
                    </button>
                </form>
            </div>
        </MotionDiv>
      </div>
    </Section>
  );
};
