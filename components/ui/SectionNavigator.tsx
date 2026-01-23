
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

interface Section {
  id: string;
  label: string;
}

export const SectionNavigator: React.FC<{ sections: Section[] }> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);

  useEffect(() => {
    let scrollTimeout: any;
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolledOnce(true);
      }
      
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 1500);

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {hasScrolledOnce && (
        <MotionDiv 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-6 bottom-32 z-[90] hidden md:flex flex-col items-end gap-6 group"
        >
            {sections.map((section, i) => {
                const isActive = activeSection === section.id;
                return (
                <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className="flex items-center gap-4 group/btn outline-none"
                >
                    {/* Label - visible on hover or scroll */}
                    <AnimatePresence>
                    {(isScrolling || isActive) && (
                        <MotionSpan
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`text-[9px] font-mono uppercase tracking-[0.4em] transition-colors duration-300 ${
                            isActive ? 'text-accent-lime' : 'text-white/40'
                        }`}
                        >
                        {section.label}
                        </MotionSpan>
                    )}
                    </AnimatePresence>

                    {/* Line Indicator */}
                    <div className="relative h-12 w-4 flex items-center justify-end">
                    <MotionDiv
                        animate={{
                        height: isActive ? '32px' : '12px',
                        width: isActive ? '3px' : '1px',
                        backgroundColor: isActive ? '#D4FF00' : 'rgba(255,255,255,0.2)',
                        }}
                        className="rounded-full transition-colors duration-500 group-hover/btn:bg-accent-lime"
                    />
                    {/* Active Pulse Glow */}
                    {isActive && (
                        <MotionDiv
                        layoutId="nav-glow"
                        className="absolute right-0 w-[1px] h-full bg-accent-lime blur-[4px] opacity-30"
                        />
                    )}
                    </div>
                </button>
                );
            })}
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};
