import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "", delay = 0, once = true }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i: number = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 0,
      scale: 1.1,
      filter: "blur(10px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const MotionDiv = motion.div as any;
  const MotionSpan = motion.span as any;

  return (
    <MotionDiv
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      className={className}
    >
      {words.map((word, index) => (
        <MotionSpan variants={child} style={{ marginRight: "0.25em" }} key={index}>
          {word}
        </MotionSpan>
      ))}
    </MotionDiv>
  );
};