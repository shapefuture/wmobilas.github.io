
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export const Header: React.FC<HeaderProps> = ({ locale, setLocale, t }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Use traditional scroll listener for rock-solid mobile reliability
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show header after scrolling past 80% of the Hero height
      setIsVisible(scrollY > viewportHeight * 0.8);

      // Section tracking for menu highlights
      const sections = ['home', 'about', 'projects', 'services', 'contact'];
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
    // Initial check in case page starts scrolled
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
    { href: "#home", label: t.home, idx: "00" },
    { href: "#about", label: t.identity, idx: "01" },
    { href: "#projects", label: t.work, idx: "02" },
    { href: "#services", label: t.caps, idx: "03" },
    { href: "#contact", label: t.contact, idx: "04" },
  ];

  return (
    <>
      {/* 
          MOBILE HEADER - BOTTOM NAVIGATION
          Refined sizing and glassmorphic transparency
      */}
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
        <div 
          className="rounded-full px-2 py-1.5 flex items-center gap-1.5 pointer-events-auto shadow-[0_15px_35px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-xl border border-white/10"
        >
          {/* Menu Grip Toggle - Smaller Sizing */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-accent-lime active:scale-90 transition-all group"
            aria-label="Toggle Menu"
          >
            <Grip size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>

          {/* Vertical Divider - Minimalist */}
          <div className="h-6 w-[1px] bg-white/10" />

          {/* Language Switcher - Smaller Sizing, color matched to menu toggle */}
          <button 
            onClick={setLocale}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-accent-lime active:scale-90 transition-all group"
          >
            <Languages size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </MotionNav>

      {/* Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MotionDiv 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-background/98 backdrop-blur-3xl flex flex-col justify-center items-center px-10 md:hidden"
          >
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`
              }} 
            />
            
            <nav className="flex flex-col gap-10 relative z-10 items-center text-center">
              {navLinks.map((link, i) => (
                <MotionA 
                  key={link.href}
                  href={link.href}
                  onClick={(e: any) => scrollToSection(e, link.href)}
                  initial={{ opacity: 0, y: 40, rotateX: 30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40, rotateX: -30 }}
                  transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col items-center gap-1 no-underline"
                >
                  <span className="text-[10px] font-mono text-accent-lime/50 group-hover:text-accent-lime transition-colors tracking-[0.5em] mb-1">
                      {link.idx}
                  </span>
                  <span className={`text-5xl font-serif italic transition-all duration-700 ${activeSection === link.href.slice(1) ? 'text-accent-lime scale-110' : 'text-white/30 group-hover:text-white'}`}>
                      {link.label}
                  </span>
                </MotionA>
              ))}
            </nav>

            <MotionButton 
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-20 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-white/5 active:bg-accent-lime group transition-all duration-500 relative z-50"
            >
                <X size={24} className="text-white group-active:text-black transition-colors" />
            </MotionButton>
          </MotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};
