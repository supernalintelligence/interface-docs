/**
 * Hero Variant Configuration
 *
 * Centralized definitions for landing page hero variants.
 * Supports A/B testing with different copy, animations, and styles.
 */

export type VariantId = 'a' | 'b' | 'c' | 'd' | 'e';

export type AnimationType = 'cycle' | 'typewriter' | 'stagger' | 'code';

export interface HeroVariantConfig {
  id: VariantId;
  name: string;
  description: string;
  primary: {
    text: string | string[]; // String for static, array for cycling
    cycleInterval?: number; // ms (only for 'cycle' animation)
    gradientClass: string; // Tailwind gradient classes
  };
  secondary: {
    lines: string[];
  };
  animation: {
    type: AnimationType;
    config?: {
      duration?: number; // seconds
      delay?: number; // seconds
      stagger?: number; // seconds between items
    };
  };
  cta: {
    primary: string;
    secondary: string;
  };
}

/**
 * All hero variants
 */
export const heroVariants: Record<VariantId, HeroVariantConfig> = {
  /**
   * Variant A: Control (Current Design)
   * Cycling word animation with existing copy
   */
  a: {
    id: 'a',
    name: 'Control - Current Design',
    description: 'Cycling word animation with original messaging',
    primary: {
      text: ['React App', 'React Website', 'Future'],
      cycleInterval: 3000,
      gradientClass: 'from-purple-400 to-pink-400'
    },
    secondary: {
      lines: ['Easy for your users', 'Fast for devs', 'Value for you']
    },
    animation: {
      type: 'cycle',
      config: { duration: 0.3 }
    },
    cta: {
      primary: 'Get Started',
      secondary: 'View Examples'
    }
  },

  /**
   * Variant B: Agentic Focus
   * "Make your App" + typewriter "Agentic"
   */
  b: {
    id: 'b',
    name: 'Agentic Focus',
    description: 'Typewriter animation emphasizing "Agentic"',
    primary: {
      text: 'Agentic', // This will be typed out after "Make your App"
      gradientClass: 'from-purple-400 to-pink-400'
    },
    secondary: {
      lines: [
        'Your users want it to work',
        'Not to learn to make it work'
      ]
    },
    animation: {
      type: 'typewriter',
      config: { duration: 1.2 }
    },
    cta: {
      primary: 'Get Started',
      secondary: 'View Examples'
    }
  },

  /**
   * Variant C: Customer Agent Focus
   * Typewriter "An Agent for your Customers"
   */
  c: {
    id: 'c',
    name: 'Customer Agent Focus',
    description: 'Typewriter animation for full customer message',
    primary: {
      text: 'An Agent for your Customers',
      gradientClass: 'from-purple-400 to-pink-400'
    },
    secondary: {
      lines: [
        'They want outcomes',
        'Not instructions'
      ]
    },
    animation: {
      type: 'typewriter',
      config: { duration: 1.8 }
    },
    cta: {
      primary: 'Get Started',
      secondary: 'View Examples'
    }
  },

  /**
   * Variant D: Value Proposition Focus
   * Cycling through key benefits with better colors
   */
  d: {
    id: 'd',
    name: 'Value Proposition',
    description: 'Cycling animation highlighting key product benefits',
    primary: {
      text: ['Agentic', 'Automatically testable', 'Supernal'],
      cycleInterval: 3000,
      gradientClass: 'from-purple-400 to-pink-400' // Better contrast
    },
    secondary: {
      lines: [
        'Easy for your users',
        'Fast for devs',
        'Value for business'
      ]
    },
    animation: {
      type: 'cycle',
      config: { duration: 0.3 }
    },
    cta: {
      primary: 'Get Started',
      secondary: 'View Examples'
    }
  },

  /**
   * Variant E: AI-Guided Tour
   * Full-page interactive tour with scroll and chat navigation
   * This variant transforms the entire landing page into an interactive experience
   */
  e: {
    id: 'e',
    name: 'AI-Guided Tour',
    description: 'Interactive tour with scroll and chat navigation - full page experience',
    primary: {
      text: 'I am here to agentify your site',
      gradientClass: 'from-purple-400 to-pink-400'
    },
    secondary: {
      lines: ['Scroll naturally or let me guide you through']
    },
    animation: {
      type: 'typewriter',
      config: { duration: 2.0 }
    },
    cta: {
      primary: 'Start Tour',
      secondary: 'Skip to Docs'
    }
  }
};

/**
 * Get variant by ID, with fallback to 'a' (control)
 */
export function getVariant(id?: string): HeroVariantConfig {
  const validId = (id && id in heroVariants) ? id as VariantId : 'a';
  return heroVariants[validId];
}

/**
 * Get all variant IDs
 */
export function getVariantIds(): VariantId[] {
  return Object.keys(heroVariants) as VariantId[];
}
