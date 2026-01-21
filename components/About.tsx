
import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Section } from './ui/Section';
import { Zap, Activity, Globe, Quote } from 'lucide-react';
import { Reveal } from './ui/Reveal';
import { MagicalText } from './ui/MagicalText';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";
const DecoderText: React.FC<{ text: string; className?: string; start?: boolean }> = ({ text, className = "", start = true }) => {
  const [displayText, setDisplayText] = useState("");
  const iteration = useRef(0);
  
  useEffect(() => {
    if (!start) return;
    
    let interval: any = null;
    
    const run = () => {
      interval = setInterval(() => {
        setDisplayText(prev => 
            text
            .split("")
            .map((letter, index) => {
              if (index < iteration.current) {
                return text[index];
              }
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        
        if (iteration.current >= text.length) {
          clearInterval(interval);
        }
        
        iteration.current += 1 / 3;
      }, 30);
    };

    run();

    return () => clearInterval(interval);
  }, [text, start]);

  return <span className={className}>{displayText}</span>;
};

const MethodNode: React.FC<{ title: string; desc: string; index: number }> = ({ title, desc, index }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
  
    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }
  
    return (
      <Reveal delay={index * 0.2}>
        <div 
            className="group relative h-full bg-white/5 border border-white/10 p-6 md:p-8 rounded-sm overflow-hidden hover:border-accent-lime/30 transition-colors duration-500"
            onMouseMove={handleMouseMove}
        >
          <motion.div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
              style={{
                  background: useMotionTemplate`
                  radial-gradient(
                      350px circle at ${mouseX}px ${mouseY}px,
                      rgba(212, 255, 0, 0.08),
                      transparent 80%
                  )
                  `,
              }}
          />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-lime to-transparent opacity-0 group-hover:opacity-50 translate-x-[-100%] group-hover:animate-[scan_2s_ease-in-out_infinite]" />
          <div className="relative z-10 flex flex-col h-full">
               <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                  <h4 className="font-serif text-lg md:text-xl text-white group-hover:text-accent-lime transition-colors">{title}</h4>
                  <span className="font-mono text-white/20 text-[10px] md:text-xs">0{index + 1}</span>
               </div>
               <p className="text-xs md:text-sm text-secondary font-mono leading-relaxed">{desc}</p>
          </div>
        </div>
      </Reveal>
    );
  };

export const About: React.FC<{ t: any }> = ({ t }) => {
  return (
    <Section id="about" className="pt-20 pb-20 bg-background relative px-6">
      <div className="absolute left-0 top-1/4 w-full h-1/2 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />

      <div className="flex flex-col gap-16 md:gap-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
            
            {/* PORTRAIT */}
            <div className="lg:w-[42%] relative order-2 lg:order-1 flex flex-col">
                 <Reveal delay={0.2} className="h-full">
                    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] rounded-sm overflow-hidden border border-white/10 group bg-[#0A0A0A]">
                        <img 
                            src="https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/personal_photo.jpg" 
                            alt="Viktor Perminov" 
                            className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700 ease-[0.22,1,0.36,1] scale-100 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute bottom-6 left-6 right-6 flex justify-center pointer-events-none">
                            <div className="inline-flex items-center justify-center gap-3 text-[9px] font-mono text-accent-lime uppercase tracking-widest border border-accent-lime/30 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full shadow-2xl">
                                <span className="whitespace-nowrap">VIKTOR PERMINOV</span>
                                <Globe size={10} className="shrink-0" />
                                <span className="whitespace-nowrap">{t.planetEarth}</span>
                            </div>
                        </div>
                    </div>
                 </Reveal>
            </div>

            {/* MISSION TEXT */}
            <div className="lg:w-[58%] flex flex-col justify-between order-1 lg:order-2">
                <div>
                    <Reveal delay={0}>
                        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent-lime/30 rounded-full text-accent-lime text-[9px] font-mono uppercase tracking-widest bg-accent-lime/5 w-fit shrink-0">
                                <Activity size={10} className="animate-pulse" />
                                <span>( 01 — {t.identity} )</span>
                            </div>
                            <span className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-[0.3em] leading-none whitespace-nowrap">
                                {t.aboutSub}
                            </span>
                        </div>
                    </Reveal>
                    
                    <div className="relative mb-10 md:mb-12">
                        <Reveal delay={0.2}>
                            <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif text-white leading-[0.9] tracking-tight drop-shadow-2xl">
                            <DecoderText text={t.missionTitle} />
                            </h2>
                        </Reveal>
                        <Reveal delay={0.4}>
                            <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white/80 to-white/40 leading-[0.9] tracking-tight mt-2 pb-2">
                                {t.mission}
                            </h2>
                        </Reveal>
                    </div>
                </div>

                {/* QUOTE SECTION */}
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="pl-5 md:pl-6 border-l-2 border-accent-lime/50 relative mt-auto"
                >
                    <div className="absolute -left-[5px] top-0 w-2 h-2 bg-accent-lime rounded-full shadow-[0_0_10px_rgba(212,255,0,0.8)] animate-pulse" />
                    
                    <motion.div
                        animate={{ y: [-3, 3, -3], rotate: [-2, 2, -2] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-3 md:mb-4 text-accent-lime opacity-80"
                    >
                        <Quote size={20} />
                    </motion.div>

                    <div className="text-lg md:text-2xl text-white/90 font-light italic mb-4 leading-relaxed">
                        <MagicalText text={t.quote} delay={0.1} />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="w-6 md:w-8 h-[1px] bg-white/20" />
                        <p className="font-mono text-[9px] md:text-xs uppercase tracking-widest text-accent-lime">
                            {t.quoteAuthor}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>

        <div className="w-full">
            <Reveal delay={0.4} width="100%">
                <div className="flex items-center justify-center gap-4 mb-8 md:mb-10 opacity-50 w-full text-center">
                        <div className="h-[1px] w-8 md:w-16 bg-white/20" />
                        <div className="flex items-center justify-center gap-2 text-[9px] font-mono uppercase tracking-widest text-white text-center w-auto">
                            <Zap size={12} className="text-accent-lime" />
                            {t.processingProtocols}
                        </div>
                        <div className="h-[1px] w-8 md:w-16 bg-white/20" />
                </div>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                <MethodNode index={0} title={t.method1Title} desc={t.bullet1} />
                <MethodNode index={1} title={t.method2Title} desc={t.bullet2} />
                <MethodNode index={2} title={t.method3Title} desc={t.bullet3} />
            </div>
        </div>
        
      </div>
    </Section>
  );
};
