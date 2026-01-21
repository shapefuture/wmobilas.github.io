
import React, { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { ManifestBanner } from './components/ManifestBanner';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Support } from './components/Support';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Preloader } from './components/Preloader';
import { CustomCursor } from './components/ui/CustomCursor';
import { SectionNavigator } from './components/ui/SectionNavigator';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { AuroraBorealis } from './components/AuroraBorealis';
import { translations, Locale } from './i18n';

const ASSETS = [
  "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/BACK.jpg",
  "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/personal_photo.jpg",
  "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/COCREATIVE.png",
  "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/MAGNUS.jpg",
  "https://cdn.jsdelivr.net/gh/wmobilas/wmobilas.github.io@master/UNI.jpg"
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [locale, setLocale] = useState<Locale>('en');
  const [auroraActive, setAuroraActive] = useState(false);
  
  const [langTransition, setLangTransition] = useState<{ active: boolean; x: number; y: number; progress: number }>({
    active: false,
    x: 0,
    y: 0,
    progress: 0
  });

  const t = useMemo(() => translations[locale], [locale]);

  const navSections = useMemo(() => [
    { id: 'home', label: t.home },
    { id: 'about', label: t.identity },
    { id: 'projects', label: t.work },
    { id: 'services', label: t.caps },
    { id: 'contact', label: t.contact },
  ], [t]);

  useEffect(() => {
    const savedLocale = localStorage.getItem('viktor_locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ru')) {
        setLocale(savedLocale);
    } else {
        const sysLang = navigator.language.slice(0, 2);
        if (sysLang === 'ru') setLocale('ru');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viktor_locale', locale);
  }, [locale]);

  useEffect(() => {
    let mounted = true;
    
    // Safety Timeout: If loading takes more than 5 seconds, force unlock
    const safetyTimeout = setTimeout(() => {
        if (mounted && loading) {
            setLoading(false);
            setProgress(100);
        }
    }, 5000);

    const loadAllAssets = async () => {
      let loadedCount = 0;
      const totalAssets = ASSETS.length;
      const updateProgress = () => {
        if (!mounted) return;
        loadedCount++;
        setProgress(Math.round((loadedCount / totalAssets) * 100));
      };
      const promises = ASSETS.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => { updateProgress(); resolve(); };
          img.onerror = () => { updateProgress(); resolve(); };
        });
      });
      await Promise.all(promises);
      if (mounted) {
        setProgress(100);
        clearTimeout(safetyTimeout);
        setTimeout(() => setLoading(false), 800);
      }
    };
    loadAllAssets();
    return () => { 
        mounted = false; 
        clearTimeout(safetyTimeout);
    };
  }, []);

  const toggleLanguage = (e: React.MouseEvent) => {
    if (langTransition.active) return;
    const x = e.clientX;
    const y = e.clientY;
    setLangTransition({ active: true, x, y, progress: 0 });
    const duration = 1200; 
    const start = performance.now();
    let hasSwitched = false;
    const frame = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(elapsed / duration, 1);
        const eased = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
        setLangTransition(prev => ({ ...prev, progress: eased }));
        if (p > 0.5 && !hasSwitched) {
            setLocale(prev => prev === 'en' ? 'ru' : 'en');
            hasSwitched = true;
        }
        if (p < 1) requestAnimationFrame(frame);
        else setLangTransition(prev => ({ ...prev, active: false }));
    };
    requestAnimationFrame(frame);
  };

  return (
    <>
      <CustomCursor />
      <AuroraBorealis active={auroraActive} />
      
      <AnimatePresence>
        {!loading && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionNavigator sections={navSections} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <ScrollToTop />
      
      {langTransition.active && (
          <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
              <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-[20px]"
                  style={{
                      maskImage: `radial-gradient(circle at ${langTransition.x}px ${langTransition.y}px, black ${langTransition.progress * 150}%, transparent ${langTransition.progress * 150}%)`,
                      WebkitMaskImage: `radial-gradient(circle at ${langTransition.x}px ${langTransition.y}px, black ${langTransition.progress * 150}%, transparent ${langTransition.progress * 150}%)`,
                  }}
              />
          </div>
      )}

      <AnimatePresence mode="wait">
        {loading && (
            <Preloader 
                progress={progress}
                onComplete={() => setLoading(false)} 
                t={t}
            />
        )}
      </AnimatePresence>
      
      <div className={`w-full bg-background text-primary selection:bg-accent-lime selection:text-black transition-opacity duration-700 ${loading ? 'opacity-0 pointer-events-none overflow-hidden' : 'opacity-100'}`}>
        <Header locale={locale} setLocale={toggleLanguage as any} t={t} />
        
        <main className="relative z-10 w-full overflow-x-hidden">
          <Hero 
            t={t} 
            startReveal={!loading} 
            onNameClick={() => setAuroraActive(!auroraActive)} 
            setLocale={toggleLanguage as any}
          />
          <ManifestBanner t={t} />
          <About t={t} />
          <Projects t={t} />
          <Services t={t} />
          <Newsletter t={t} />
          <Contact t={t} />
          <Support t={t} />
        </main>
        
        <Footer t={t} />
      </div>
    </>
  );
};

export default App;
