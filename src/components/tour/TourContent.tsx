'use client';

/**
 * Tour Content - Scrollable Sections for AI-Guided Tour
 *
 * Features:
 * - Full-page sections that reveal on scroll or AI command
 * - Auto-scroll when AI tour advances section
 * - Scroll detection to update currentSection
 * - Progressive reveal animations
 */

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTourContext } from './TourContext';
import { HeroSection } from './sections/HeroSection';
import { WhatSection } from './sections/WhatSection';
import { HowSection } from './sections/HowSection';
import { ExamplesSection } from './sections/ExamplesSection';
import { GetStartedSection } from './sections/GetStartedSection';

export function TourContent() {
  const { sections, currentSection, isAutoTourMode, goToSection } = useTourContext();
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const isScrollingProgrammatically = useRef(false);

  // Section components mapping
  const sectionComponents = [
    <HeroSection key="hero" />,
    <WhatSection key="what" />,
    <HowSection key="how" />,
    <ExamplesSection key="examples" />,
    <GetStartedSection key="get-started" />,
  ];

  // Auto-scroll when AI tour advances section
  useEffect(() => {
    if (isAutoTourMode && sectionRefs.current[currentSection]) {
      isScrollingProgrammatically.current = true;

      sectionRefs.current[currentSection]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Reset flag after scroll completes
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 1000);
    }
  }, [currentSection, isAutoTourMode]);

  // Scroll detection - update section when user scrolls manually
  useEffect(() => {
    const handleScroll = () => {
      // Don't update section if we're scrolling programmatically
      if (isScrollingProgrammatically.current || isAutoTourMode) return;

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      // Find which section is currently in view
      sectionRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            if (index !== currentSection) {
              goToSection(index);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, isAutoTourMode, goToSection]);

  return (
    <div className="relative">
      {sectionComponents.map((component, index) => (
        <motion.section
          key={sections[index].id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="min-h-screen flex items-center justify-center transition-opacity duration-700"
          initial={{ opacity: 0.3 }}
          animate={{
            opacity: index <= currentSection ? 1 : 0.3,
          }}
          transition={{ duration: 0.5 }}
          data-tour-section={sections[index].id}
          data-section-index={index}
        >
          {component}
        </motion.section>
      ))}
    </div>
  );
}
