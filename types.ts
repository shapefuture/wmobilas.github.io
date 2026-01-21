import React, { ReactNode } from 'react';

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export interface ProjectData {
  title: string;
  description: string;
  image: string;
  link: string;
  linkText: string;
  tags: string[];
  color: string;
}

export interface ServiceData {
  title: string;
  description: string;
  icon: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}