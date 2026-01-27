'use client';

/**
 * Tour Context - State Management for AI-Guided Tour
 *
 * Manages:
 * - Current section index
 * - Section definitions (content, narration)
 * - Navigation methods (next, prev, goTo)
 * - Auto-tour mode (AI-guided vs manual scroll)
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Tour Section Definition
 */
export interface TourSection {
  id: string;
  title: string;
  content: ReactNode;
  narration: string; // AI narration text for this section
}

/**
 * Tour Context Value
 */
export interface TourContextValue {
  currentSection: number;
  sections: TourSection[];
  totalSections: number;
  goToSection: (index: number) => void;
  nextSection: () => void;
  prevSection: () => void;
  isAutoTourMode: boolean;
  setAutoTourMode: (enabled: boolean) => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

/**
 * Hook to access Tour Context
 */
export function useTourContext(): TourContextValue {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTourContext must be used within TourProvider');
  }
  return context;
}

/**
 * Tour Provider Props
 */
interface TourProviderProps {
  children: ReactNode;
}

/**
 * Tour Provider Component
 */
export function TourProvider({ children }: TourProviderProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isAutoTourMode, setAutoTourMode] = useState(false);

  // Define tour sections
  const sections: TourSection[] = [
    {
      id: 'hero',
      title: 'Welcome',
      content: null, // Will be populated in TourContent
      narration:
        "I am here to agentify your site. Let me show you how Supernal Interface transforms static React apps into intelligent, AI-controllable experiences. Say 'next' to continue, or scroll naturally at your own pace.",
    },
    {
      id: 'what',
      title: 'What is Agentification?',
      content: null,
      narration:
        "Agentification means giving AI the ability to understand and control your UI. Instead of users clicking through complex interfaces, they tell an AI what they want, and the AI navigates and executes actions for them. It's like having a personal assistant that knows your app inside and out.",
    },
    {
      id: 'how',
      title: 'How It Works',
      content: null,
      narration:
        "Supernal Interface uses three core concepts: Named Contracts for type-safe references, Tools that AI can call to perform actions, and a Navigation Graph that maps your app's structure. This architecture enables AI to understand your UI without fragile selectors or hardcoded paths.",
    },
    {
      id: 'examples',
      title: 'Live Examples',
      content: null,
      narration:
        "See Supernal in action. These examples show real applications where users can navigate, fill forms, and complete tasks just by chatting with an AI. No clicking, no tutorials needed - just natural conversation.",
    },
    {
      id: 'get-started',
      title: 'Get Started',
      content: null,
      narration:
        "Ready to make your app agentic? Install Supernal Interface with npm, wrap your app with SupernalProvider, and start defining tools. You can have AI-powered navigation running in under 5 minutes. Want to see the docs or try it yourself?",
    },
  ];

  const totalSections = sections.length;
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === sections.length - 1;

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
    }
  };

  const nextSection = () => {
    if (!isLastSection) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const prevSection = () => {
    if (!isFirstSection) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const value: TourContextValue = {
    currentSection,
    sections,
    totalSections,
    goToSection,
    nextSection,
    prevSection,
    isAutoTourMode,
    setAutoTourMode,
    isFirstSection,
    isLastSection,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}
