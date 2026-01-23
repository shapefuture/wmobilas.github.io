
import React from 'react';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

interface MagicalTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const MagicalText: React.FC<MagicalTextProps> = ({ text, className = "", delay = 0 }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.015, 
        delayChildren: delay 
      },
    },
  };

  const letter = {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      scale: 1.1,
      y: 20,
      x: 5, // Subtle lateral shift for better organic feel
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8, // Snappier
        ease: [0.2, 0.65, 0.3, 0.9], // Custom Bezier for "Liquid" snap
      },
    },
  };

  return (
    <MotionDiv
      key={text}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={`inline-block w-full ${className}`}
      style={{ wordBreak: 'normal', overflowWrap: 'break-word' }}
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap align-top">
            {word.split("").map((char, charIndex) => (
              <MotionSpan 
                  key={`${wordIndex}-${charIndex}`} 
                  variants={letter}
                  className="inline-block origin-center will-change-transform"
              >
                {char}
              </MotionSpan>
            ))}
          </span>
          <span className="inline-block whitespace-pre"> </span>
        </React.Fragment>
      ))}
    </MotionDiv>
  );
};
