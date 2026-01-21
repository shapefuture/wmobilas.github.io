import React from 'react';
import { SectionProps } from '../../types';

export const Section: React.FC<SectionProps> = ({ children, className = "", id }) => {
  return (
    <section id={id} className={`py-20 md:py-32 px-4 md:px-8 max-w-7xl mx-auto relative z-10 ${className}`}>
      {children}
    </section>
  );
};
