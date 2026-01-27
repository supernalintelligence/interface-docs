'use client';

/**
 * Hero Section - "I am here to agentify your site"
 *
 * First section of the AI-guided tour with typewriter animation
 */

import React from 'react';
import { motion } from 'framer-motion';
import { getVariant } from '@/config/hero-variants';
import { theme, components, cn } from '@/config/theme';

export function HeroSection() {
  const variant = getVariant('e');

  return (
    <div className={cn(
      'relative w-full overflow-hidden',
      theme.colors.background.gradient.hero,
      'py-32'
    )}>
      <div className={components.section.container}>
        <div className="text-center">
          {/* Main heading with typewriter effect */}
          <motion.h1
            className={cn(
              theme.typography.hero.title,
              theme.colors.text.primary,
              'mb-6 px-2'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className={`bg-gradient-to-r ${variant.primary.gradientClass} bg-clip-text text-transparent`}>
              {variant.primary.text}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className={cn(
              theme.typography.hero.subtitle,
              'mb-10 px-2'
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className={theme.colors.text.secondary}>
              {variant.secondary.lines[0]}
            </p>
          </motion.div>

          {/* Instruction hint */}
          <motion.div
            className="flex flex-col items-center justify-center gap-3 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span>Scroll down</span>
              </div>
              <span className="text-gray-600">or</span>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Use chat to navigate</span>
              </div>
            </div>
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2 text-purple-200">
              <span className="font-semibold">Press</span>{' '}
              <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-600 text-xs font-mono">
                {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? 'Cmd + /' : '/'}
              </kbd>{' '}
              <span className="font-semibold">to open chat</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse" />
      <div
        className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}
