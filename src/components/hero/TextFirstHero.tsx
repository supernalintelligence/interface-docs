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
              className={`inline-block overflow-hidden whitespace-nowrap bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}
              style={{
                lineHeight: '1.3',
                paddingBottom: '0.1em',
                marginTop: '0.1em'
              }}
            >
              {text as string}
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
          className="space-y-3 text-xl md:text-2xl text-gray-300"
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              custom={i}
              variants={staggerLineAnimation}
              dangerouslySetInnerHTML={{ __html: line }}
              className="text-gray-300"
            />
          ))}
        </motion.div>
      );
    }

    // Default: simple static text for Variants A & D
    return (
      <div className="space-y-2 text-xl md:text-2xl text-gray-300">
        {lines.map((line, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TEXT ALWAYS AT TOP - NEVER HIDDEN */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {renderPrimaryText()}
          </h1>

          <div className="mb-10">
            {renderSecondaryText()}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/50"
            >
              {variant.cta.primary}
            </button>
            <button
              onClick={onTryDemo}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
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
