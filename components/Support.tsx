
import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { Heart, ArrowUpRight, Mail, Send, MessageCircle } from 'lucide-react';
import { SupportModal } from './SupportModal';

const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const ref = useRef<HTMLDivElement>(null);
    const position = { x: useMotionValue(0), y: useMotionValue(0) };
    
    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        const { clientX, clientY } = e;
        if (!ref.current) return;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        position.x.set(middleX * 0.3);
        position.y.set(middleY * 0.3);
    };

    const reset = () => {
        position.x.set(0);
        position.y.set(0);
    };

    const { x, y } = position;
    const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    return (
        <MotionDiv 
            ref={ref} 
            onMouseMove={handleMouse} 
            onMouseLeave={reset}
            style={{ x: springX, y: springY } as any}
            className="flex items-center justify-center"
        >
            {children}
        </MotionDiv>
    );
};

export const Support: React.FC<{ t: any }> = ({ t }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
        <Section id="support" className="py-24 md:py-32 relative overflow-hidden">
        {/* Premium Background FX - Heartbeat Resonance */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <MotionDiv 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.05, 0.1, 0.05],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-[600px] h-[600px] bg-accent-lime/10 rounded-full blur-[100px]"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_70%)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <div className="flex flex-col items-center">
                <Reveal width="100%">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <MotionDiv
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-accent-lime/20 blur-xl rounded-full"
                            />
                            <Heart size={32} className="text-accent-lime relative z-10 fill-accent-lime/20" />
                        </div>
                    </div>
                </Reveal>

                <Reveal width="100%" delay={0.1}>
                    <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight [text-wrap:balance]">
                        {t.supportTitle}
                    </h2>
                </Reveal>

                <Reveal width="100%" delay={0.2}>
                    <p className="text-lg md:text-xl text-secondary font-light max-w-2xl mx-auto mb-12 leading-relaxed [text-wrap:balance]">
                        {t.supportDesc}
                    </p>
                </Reveal>

                <Reveal width="100%" delay={0.3}>
                    <Magnetic>
                        <MotionButton 
                            onClick={() => setShowModal(true)}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="relative group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full font-serif text-xl md:text-2xl transition-all duration-300 hover:scale-105 cursor-none"
                        >
                            {/* Glow effect on hover */}
                            <div className={`absolute -inset-4 bg-accent-lime/40 blur-xl rounded-full transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                            
                            <span className="relative z-10 italic tracking-wide">{t.supportButton}</span>
                            <div className="relative z-10 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-accent-lime group-hover:text-black transition-colors duration-300">
                                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform duration-300" />
                            </div>
                        </MotionButton>
                    </Magnetic>
                </Reveal>
            </div>

            <div className="mt-20 md:mt-32 w-full max-w-2xl mx-auto border-t border-white/10 pt-16">
                <Reveal width="100%" delay={0.4}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
                        {/* Socials Column */}
                        <div className="flex flex-col items-center">
                            <h4 className="font-serif text-2xl text-white mb-8 italic">{t.socials}</h4>
                            <div className="flex flex-col gap-4 text-center">
                                <a href="https://twitter.com/wmobilas" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent-lime transition-colors font-mono text-xs md:text-sm uppercase tracking-[0.2em] hover:tracking-[0.3em] duration-300">Twitter (X)</a>
                                <a href="https://www.linkedin.com/in/wmobilas" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent-lime transition-colors font-mono text-xs md:text-sm uppercase tracking-[0.2em] hover:tracking-[0.3em] duration-300">LinkedIn</a>
                                <a href="http://instagram.com/viktorperminov.me" target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent-lime transition-colors font-mono text-xs md:text-sm uppercase tracking-[0.2em] hover:tracking-[0.3em] duration-300">Instagram</a>
                            </div>
                        </div>

                        {/* Direct Column */}
                        <div className="flex flex-col items-center">
                            <h4 className="font-serif text-2xl text-white mb-8 italic">{t.direct}</h4>
                            <div className="flex flex-col gap-4 items-center">
                                <a href="mailto:wmobilas@gmail.com" className="group text-secondary hover:text-accent-lime transition-colors font-mono text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Mail size={12} className="group-hover:scale-110 transition-transform"/> Email
                                </a>
                                <a href="http://t.me/wmobilas" target="_blank" rel="noopener noreferrer" className="group text-secondary hover:text-accent-lime transition-colors font-mono text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                                    <Send size={12} className="group-hover:scale-110 transition-transform" /> Telegram
                                </a>
                                <a href="https://wa.me/17045941024" target="_blank" rel="noopener noreferrer" className="group text-secondary hover:text-accent-lime transition-colors font-mono text-xs md:text-sm uppercase tracking-[0.2em] flex items-center gap-3">
                                    <MessageCircle size={12} className="group-hover:scale-110 transition-transform" /> WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </div>
        </Section>
        
        <SupportModal isOpen={showModal} onClose={() => setShowModal(false)} t={t} />
    </>
  );
};
