
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, Languages, Grip } from 'lucide-react';

const MotionNav = motion.nav as any;
const MotionDiv = motion.div as any;
const MotionA = motion.a as any;
const MotionButton = motion.button as any;

interface HeaderProps {
  locale: string;
  setLocale: (e: React.MouseEvent) => void;
  t: any;
}

/**
 * SIGGRAPH Tier Background Grid
 * Provides a subtle holographic depth to the menu overlay.
 */
const MenuBackgroundFX = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <div 
      className="absolute inset-0" 
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(212, 255, 0, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(212, 255, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
      }}
    />
    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-accent-lime/10 to-transparent blur-[120px]" />
    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-accent-lime/5 to-transparent blur-[100px]" />
  </div>
);

export const Header: React.FC<HeaderProps> = ({ locale, setLocale, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setIsVisible(scrollY > viewportHeight * 0.8);

      const sections = ['home', 'about', 'projects', 'services', 'contact', 'support'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300 && rect.bottom >= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
  }, [mobileMenuOpen]);

  const scrollToSection = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  }, []);

  const navLinks = [
    { href: "#about", label: t.identity, idx: "01" },
    { href: "#projects", label: t.work, idx: "02" },
    { href: "#services", label: t.caps, idx: "03" },
    { href: "#contact", label: t.contact, idx: "04" },
    { href: "#support", label: t.support, idx: "05" },
  ];

  return (
    <>
      <MotionNav 
        initial={false}
        animate={{ 
            y: isVisible ? 0 : 120, 
            opacity: isVisible ? 1 : 0 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 40,
          opacity: { duration: 0.2 }
        }}
        className="fixed bottom-8 left-0 right-0 z-[10000] flex justify-center pointer-events-none px-6 md:hidden"
      >
        <div className="rounded-full px-2 py-1.5 flex items-center gap-1.5 pointer-events-auto shadow-[0_15px_35px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-xl border border-white/10">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-accent-lime active:scale-90 transition-all group"
          >
            <Grip size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
          <div className="h-6 w-[1px] bg-white/10" />
          <button 
            onClick={setLocale}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-accent-lime active:scale-90 transition-all group"
          >
            <Languages size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </MotionNav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-background/98 backdrop-blur-3xl flex flex-col justify-center items-center px-6 md:hidden overflow-hidden"
          >
            <MenuBackgroundFX />
            
            <nav className="flex flex-col gap-4 md:gap-6 relative z-10 items-center text-center w-full max-w-xs">
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <MotionA 
                    key={link.href}
                    href={link.href}
                    onClick={(e: any) => scrollToSection(e, link.href)}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex flex-col items-center gap-0.5 no-underline relative py-1 w-full"
                  >
                    {/* Telemetry Index */}
                    <span className={`text-[7px] font-mono transition-colors tracking-[0.5em] mb-0.5 ${isActive ? 'text-accent-lime/80' : 'text-white/20'}`}>
                        {link.idx.split('').join(' ')}
                    </span>

                    {/* Navigation Label - Refined sizing for single-screen fit */}
                    <span className={`relative text-4xl sm:text-5xl font-serif italic transition-all duration-700 ease-[0.22,1,0.36,1] ${isActive ? 'text-accent-lime scale-105 drop-shadow-[0_0_15px_rgba(212,255,0,0.25)]' : 'text-white/30 group-hover:text-white/80'}`}>
                        {link.label}
                        
                        {/* Active Radiant Glow */}
                        {isActive && (
                          <MotionDiv 
                            layoutId="menu-active-glow"
                            className="absolute -inset-x-6 -inset-y-3 bg-accent-lime/5 blur-2xl rounded-full -z-10"
                          />
                        )}
                    </span>

                    {/* Bottom Scanning Line */}
                    <div className="w-0 group-hover:w-1/3 h-px bg-gradient-to-r from-transparent via-accent-lime/30 to-transparent transition-all duration-500 mt-1" />
                  </MotionA>
                );
              })}
            </nav>

            <MotionButton 
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-10 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 active:bg-accent-lime group transition-all duration-500 relative z-50"
            >
                <X size={24} className="text-white group-active:text-black transition-colors" />
            </MotionButton>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};
