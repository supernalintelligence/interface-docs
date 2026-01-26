/**
 * Hero Animation Utilities
 *
 * Reusable Framer Motion animation variants for hero section.
 * Supports cycling, typewriter, stagger, and code reveal animations.
 */

import { Variants } from 'framer-motion';

/**
 * Cycling word animation (Variant A - Control)
 * Fade in/out with slight vertical translation
 */
export const cycleAnimation: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

/**
 * Typewriter animation (Variants B & C)
 * Character-by-character reveal effect
 *
 * Usage:
 * <motion.span
 *   initial="initial"
 *   animate="animate"
 *   variants={typewriterAnimation}
 *   custom={{ duration: 2 }}
 * />
 */
export const typewriterAnimation: Variants = {
  initial: {
    width: 0,
    opacity: 0
  },
  animate: (custom?: { duration?: number }) => ({
    width: 'auto',
    opacity: 1,
    transition: {
      width: {
        duration: custom?.duration || 2,
        ease: 'linear'
      },
      opacity: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  })
};

/**
 * Stagger line animation (Variant C)
 * Multi-line sequential fade-in with slide-up
 */
export const staggerLineAnimation: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

/**
 * Code reveal animation (Variant D)
 * Terminal-style line-by-line reveal
 */
export const codeRevealAnimation: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

/**
 * Container for stagger children (Variants C & D)
 * Orchestrates sequential animations
 */
export const staggerContainerAnimation: Variants = {
  hidden: {},
  visible: (custom?: { stagger?: number; delay?: number }) => ({
    transition: {
      staggerChildren: custom?.stagger || 0.1,
      delayChildren: custom?.delay || 0
    }
  })
};

/**
 * Gradient pulse animation (optional enhancement)
 * Subtle pulse effect for emphasis words
 */
export const gradientPulseAnimation: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut'
    }
  }
};

/**
 * Cursor blink animation for typewriter effect
 * CSS-based keyframe animation
 */
export const cursorBlinkKeyframes = `
  @keyframes cursorBlink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
`;

/**
 * Tailwind classes for cursor blink effect
 * Use with typewriter animation
 */
export const cursorBlinkClass = 'border-r-4 border-purple-400 animate-[cursorBlink_1s_step-end_infinite]';
