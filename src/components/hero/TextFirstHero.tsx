/**
 * Text-First Hero Component
 *
 * Supports 4 variants with different animations:
 * - Variant A: Cycling word animation (control)
 * - Variant B: Typewriter effect (problem-solution)
 * - Variant C: Stagger fade-in (user-benefit)
 * - Variant D: Code reveal (developer-first)
 *
 * Variant selection: Query param > Env var > Default (a)
 * No emojis - clean, professional
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { getVariant } from '@/config/hero-variants';
import { theme, components, cn } from '@/config/theme';
import {
  cycleAnimation,
  typewriterAnimation,
  staggerLineAnimation,
  staggerContainerAnimation
} from './animations/HeroAnimations';

interface TextFirstHeroProps {
  onGetStarted?: () => void;
  onTryDemo?: () => void;
}

export const TextFirstHero: React.FC<TextFirstHeroProps> = ({
  onGetStarted = () => window.location.href = '/docs',
  onTryDemo = () => window.location.href = '/examples'
}) => {
  const router = useRouter();

  // Variant detection: Query param > Env var > Default
  const variantId =
    (router.query.variant as string) ||
    process.env.NEXT_PUBLIC_HERO_VARIANT ||
    'a';

  const variant = getVariant(variantId);

  // State for cycling animation (Variant A only)
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Cycling logic (only for Variant A)
  useEffect(() => {
    if (variant.animation.type !== 'cycle') return;

    const words = variant.primary.text as string[];
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, variant.animation.config?.duration ? variant.animation.config.duration * 1000 : 300);
    }, variant.primary.cycleInterval || 3000);

    return () => clearInterval(interval);
  }, [variant]);

  // Render primary text based on animation type
  const renderPrimaryText = () => {
    const { type } = variant.animation;
    const { text, gradientClass } = variant.primary;

    switch (type) {
      case 'cycle': {
        const words = text as string[];
        // Variant A: "Agentify your [word]"
        // Variant D: "Make your App [word]"
        const isVariantA = variant.id === 'a';

        return (
          <>
            {isVariantA ? 'Agentify your' : 'Make your App'} <br />
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                {...cycleAnimation}
                transition={{ duration: variant.animation.config?.duration || 0.3 }}
                className={`inline-block bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                style={{
                  lineHeight: '1.3',
                  paddingBottom: '0.15em',
                  paddingTop: '0.05em',
                  marginBottom: '-0.05em'
                }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
            {isVariantA && (
              <>
                <br />
                in minutes
              </>
            )}
          </>
        );
      }

      case 'typewriter': {
        // Variants B & C: "Make your App" + typewriter text
        return (
          <>
            Make your App <br />
            <motion.span
              initial="initial"
              animate="animate"
              variants={typewriterAnimation}
              custom={{ duration: variant.animation.config?.duration || 1.5 }}
              className={`inline-block overflow-hidden whitespace-nowrap`}
              style={{
                lineHeight: '1.3',
                paddingBottom: '0.1em',
                marginTop: '0.1em'
              }}
            >
              <span
                className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {text as string}
              </span>
            </motion.span>
          </>
        );
      }

      default:
        return <span>{text}</span>;
    }
  };

  // Render secondary text based on animation type
  const renderSecondaryText = () => {
    const { type } = variant.animation;
    const { lines } = variant.secondary;

    if (type === 'typewriter') {
      // Animated stagger fade-in for typewriter variants (B & C)
      // Delay until after the primary text appears
      const primaryDelay = (variant.animation.config?.duration || 1.5);
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainerAnimation}
          custom={{ stagger: 0.3, delay: primaryDelay + 0.5 }}
          className={cn('space-y-3', theme.typography.hero.subtitle)}
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={staggerLineAnimation}
              dangerouslySetInnerHTML={{ __html: line }}
              className={theme.colors.text.secondary}
              style={{ color: 'rgb(243, 244, 246)' }}
            />
          ))}
        </motion.div>
      );
    }

    // Default: simple static text for Variants A & D
    return (
      <div className={cn('space-y-2', theme.typography.hero.subtitle)}>
        {lines.map((line, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: line }}
            className={theme.colors.text.secondary}
            style={{ color: 'rgb(243, 244, 246)' }}
          />
        ))}
      </div>
    );
  };

  return (
    <section className={cn(
      'relative overflow-hidden',
      theme.colors.background.gradient.hero,
      theme.spacing.hero.paddingTop.mobile,
      theme.spacing.hero.paddingTop.tablet,
      theme.spacing.hero.paddingTop.desktop,
      theme.spacing.hero.paddingBottom.mobile,
      theme.spacing.hero.paddingBottom.tablet,
      theme.spacing.hero.paddingBottom.desktop
    )}>
      <div className={components.section.container}>
        {/* TEXT ALWAYS AT TOP - NEVER HIDDEN */}
        <div className={cn('text-center', theme.spacing.hero.marginBottom.section)}>
          <h1 className={cn(
            theme.typography.hero.title,
            theme.colors.text.primary,
            theme.spacing.hero.marginBottom.title,
            'px-2'
          )}>
            {renderPrimaryText()}
          </h1>

          <div className={cn(theme.spacing.hero.marginBottom.subtitle, 'px-2')}>
            {renderSecondaryText()}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button
              onClick={onGetStarted}
              className={components.button.primary('medium')}
            >
              {variant.cta.primary}
            </button>
            <button
              onClick={onTryDemo}
              className={components.button.secondary('medium')}
            >
              {variant.cta.secondary}
            </button>
          </div>
        </div>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-pink-500/30 rounded-full filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};
