import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, ExternalLink, Zap, Heart } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, t }) => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting state for SSR/Portal safety
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCopyZelle = () => {
    navigator.clipboard.writeText('wmobilas@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: { 
      opacity: 1, 
      backdropFilter: "blur(12px)",
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    },
    exit: { 
      opacity: 0, 
      backdropFilter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeInOut" } 
    }
  };

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 20 },
    visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 350, 
          damping: 25,
          mass: 0.8
        } 
    },
    exit: { 
      scale: 0.95, 
      opacity: 0, 
      y: 10, 
      transition: { duration: 0.2, ease: "easeIn" } 
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="support-modal-wrapper"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 transform-gpu"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            key="support-modal-container"
            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform-gpu will-change-transform"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-accent-lime/10 blur-[80px] pointer-events-none" />
            
            {/* Header */}
            <div className="relative z-10 p-8 pb-4 flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent-lime/30 rounded-full text-accent-lime text-[10px] font-mono uppercase tracking-widest bg-accent-lime/5 mb-4">
                    <Heart size={10} className="fill-accent-lime" />
                    <span>SUPPORT_PROTOCOLS</span>
                </div>
                <p className="text-secondary text-sm leading-relaxed max-w-sm [text-wrap:balance]">
                   {t.supportModalDesc}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full outline-none"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative z-10 px-8 pb-8 flex flex-col gap-6">
                
                {/* PRIORITY SECTION */}
                <div className="space-y-3">
                    <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent-lime/80 flex items-center gap-2">
                        <Zap size={10} /> {t.preferredMethods}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Revolut */}
                        <a 
                           href="https://revolut.me/wmobilas" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="group flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent-lime/50 hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-serif italic text-xl text-white">Revolut</span>
                                <ExternalLink size={14} className="text-white/30 group-hover:text-accent-lime transition-colors" />
                            </div>
                            <span className="text-[10px] font-mono text-white/40 group-hover:text-white/60">revolut.me/wmobilas</span>
                        </a>

                        {/* Zelle */}
                        <button 
                           onClick={handleCopyZelle}
                           className="group flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent-lime/50 hover:bg-white/10 transition-all duration-300 text-left relative overflow-hidden outline-none"
                        >
                             <div className="flex justify-between items-center mb-2 relative z-10">
                                <span className="font-serif italic text-xl text-white">Zelle</span>
                                {copied ? <Check size={14} className="text-accent-lime" /> : <Copy size={14} className="text-white/30 group-hover:text-accent-lime transition-colors" />}
                            </div>
                            <span className="text-[10px] font-mono text-white/40 group-hover:text-white/60 relative z-10">wmobilas@gmail.com</span>
                            
                            {/* Copied Feedback Overlay */}
                            <AnimatePresence>
                                {copied && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-accent-lime flex items-center justify-center z-20 pointer-events-none"
                                    >
                                        <span className="text-black font-bold font-mono text-xs uppercase tracking-widest">{t.copied}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                <div className="w-full h-px bg-white/5" />

                {/* ADDITIONAL SECTION */}
                <div className="space-y-3">
                     <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">
                        {t.otherMethods}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         {/* PayPal */}
                         <a 
                           href="https://www.paypal.me/VPyerminov" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-between px-4 py-3 rounded-lg bg-black border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <span className="text-white/70 font-mono text-sm group-hover:text-white transition-colors">PayPal</span>
                            <ExternalLink size={12} className="text-white/20 group-hover:text-white/50" />
                        </a>

                         {/* Venmo */}
                         <a 
                           href="https://venmo.com/code?user_id=2611611621654528413&created=1769402360" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center justify-between px-4 py-3 rounded-lg bg-black border border-white/5 hover:border-white/20 transition-all group"
                        >
                            <span className="text-white/70 font-mono text-sm group-hover:text-white transition-colors">Venmo</span>
                            <ExternalLink size={12} className="text-white/20 group-hover:text-white/50" />
                        </a>
                    </div>
                </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
