
import React, { useRef } from 'react';
import { motion, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Section } from './ui/Section';
import { Reveal } from './ui/Reveal';
import { MagicalText } from './ui/MagicalText';
import { ArrowUpRight, Quote } from 'lucide-react';

const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;

interface ProjectProps {
  title: string;
  category: string;
  image: string;
  link: string;
  year: string;
  index: number;
  hoverDesc: string;
}

const ProjectCard: React.FC<ProjectProps> = ({ title, category, image, link, year, index, hoverDesc }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div className="group flex flex-col h-full">
      <Reveal delay={index * 0.15} width="100%">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-black border border-white/10 rounded-sm mb-4 md:mb-6 transition-colors duration-500 group-hover:border-accent-lime/30"
          ref={ref}
          onMouseMove={handleMouseMove}
        >
            <MotionDiv
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
                style={{
                    background: useMotionTemplate`
                    radial-gradient(
                        650px circle at ${mouseX}px ${mouseY}px,
                        rgba(255, 255, 255, 0.07),
                        transparent 80%
                    )
                    `,
                }}
            />

            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12 z-10 overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                    <MotionImg 
                        src={image} 
                        alt={title}
                        className="w-full h-auto max-h-full object-contain filter grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-[0.16,1,0.3,1] drop-shadow-2xl"
                        style={{
                            x: useTransform(mouseX, [0, 500], [5, -5]),
                            y: useTransform(mouseY, [0, 500], [5, -5]),
                            scale: 1
                        } as any}
                        whileHover={{ scale: 1.05 }}
                    />
                </div>
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,6px_100%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* HOVER DESCRIPTION OVERLAY */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-40 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md -z-10 border-t border-accent-lime/50" />
                <p className="text-[10px] md:text-sm font-mono text-white/90 leading-relaxed">
                    {hoverDesc}
                </p>
            </div>

            <div className="absolute top-4 right-4 z-40">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-sm border border-white/5 group-hover:bg-accent-lime group-hover:text-black transition-all duration-500 scale-90 group-hover:scale-110">
                    <ArrowUpRight size={14} />
                </div>
            </div>
            
            <div className="absolute top-4 left-4 z-40">
                <span className="text-[8px] font-mono uppercase tracking-widest text-white/30 group-hover:text-white/70 transition-colors">
                    IDX_{index + 1}
                </span>
            </div>
        </a>
      </Reveal>

      <div className="flex justify-between items-start border-t border-white/10 pt-4 px-1">
        <div>
            <Reveal delay={index * 0.15 + 0.1}>
                <h3 className="text-xl md:text-2xl font-serif text-white mb-1 group-hover:text-accent-lime transition-colors duration-300 [text-wrap:balance]">
                    {title}
                </h3>
            </Reveal>
            <Reveal delay={index * 0.15 + 0.2}>
                <span className="text-[10px] md:text-xs font-mono text-secondary uppercase tracking-widest">
                    {category}
                </span>
            </Reveal>
        </div>
        <Reveal delay={index * 0.15 + 0.3}>
            <span className="text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-widest mt-1.5">
                {year}
            </span>
        </Reveal>
      </div>
    </div>
  );
};

export const Projects: React.FC<{ t: any }> = ({ t }) => {
  const projects = [
    {
        title: t.project1Title, 
        category: t.catEdTech,
        image: "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/_UNI.jpg",
        link: "http://universityofstudents.org",
        year: "2023",
        hoverDesc: t.project1Hover
    },
    {
        title: t.project3Title,
        category: t.catSocialRnD,
        image: "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/_COCREATIVE.jpg",
        link: "http://u.nu/cocreator",
        year: "2024",
        hoverDesc: t.project3Hover
    },
    {
        title: t.project2Title, 
        category: t.catAccelerator,
        image: "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/_MAGNUS.jpg",
        link: "https://www.instagram.com/magnusanim.us",
        year: "2025",
        hoverDesc: t.project2Hover
    }
  ];

  return (
    <Section id="projects" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center mb-24 md:mb-32 relative">
            <MotionDiv 
                className="block text-accent-lime mb-6 md:mb-8"
                animate={{ y: [-5, 5, -5], rotate: [-3, 3, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
                <Quote size={28} className="mx-auto opacity-80" />
            </MotionDiv>
            
            <div className="text-xl md:text-4xl font-light leading-relaxed text-white italic font-serif [text-wrap:balance]">
                <MagicalText text={t.projectsQuote} delay={0.2} />
            </div>
      </div>

      <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
         <Reveal delay={0.4}>
            <div>
                <div className="inline-block px-3 py-1 border border-accent-lime/30 rounded-full text-accent-lime text-[9px] font-mono uppercase tracking-widest mb-4">
                    ( 02 — {t.selectedWorks} )
                </div>
                <h2 className="text-3xl md:text-6xl font-serif text-white [text-wrap:balance]">{t.projectsTitle}</h2>
            </div>
         </Reveal>
         <Reveal delay={0.6}>
             <span className="text-[10px] font-mono text-secondary uppercase tracking-widest md:text-right">
                {t.caseStudies} <br className="hidden md:block"/> {t.archivalIndex}
             </span>
         </Reveal>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {projects.map((p, i) => (
            <ProjectCard key={i} index={i} {...p} />
        ))}
      </div>
    </Section>
  );
};
