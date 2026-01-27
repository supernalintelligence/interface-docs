/**
 * Supernal Interface Theme Configuration
 *
 * Centralized design tokens for consistent styling across all components.
 * Use these values instead of hardcoding Tailwind classes to enable
 * easy global updates.
 */

export const theme = {
  // Spacing scale (mobile-first with responsive overrides)
  spacing: {
    section: {
      paddingY: {
        mobile: 'py-12',      // 3rem (48px)
        tablet: 'sm:py-16',   // 4rem (64px)
        desktop: 'lg:py-20'   // 5rem (80px)
      },
      paddingX: 'px-4 sm:px-6 lg:px-8',
      gap: {
        small: 'gap-3 sm:gap-4',
        medium: 'gap-4 sm:gap-6',
        large: 'gap-6 sm:gap-8'
      }
    },
    hero: {
      paddingTop: {
        mobile: 'pt-20',      // Account for mobile header
        tablet: 'sm:pt-24',
        desktop: 'lg:pt-32'
      },
      paddingBottom: {
        mobile: 'pb-12',
        tablet: 'sm:pb-16',
        desktop: 'lg:pb-20'
      },
      marginBottom: {
        title: 'mb-4 sm:mb-6',
        subtitle: 'mb-8 sm:mb-10',
        section: 'mb-12 sm:mb-16'
      }
    },
    card: {
      padding: 'p-4 sm:p-6',
      gap: 'gap-3 sm:gap-4'
    }
  },

  // Typography scale
  typography: {
    hero: {
      title: 'text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight',
      subtitle: 'text-lg sm:text-xl md:text-2xl',
      body: 'text-base sm:text-lg'
    },
    heading: {
      h1: 'text-3xl sm:text-4xl md:text-5xl font-bold',
      h2: 'text-2xl sm:text-3xl md:text-4xl font-bold',
      h3: 'text-xl sm:text-2xl md:text-3xl font-semibold',
      h4: 'text-lg sm:text-xl font-semibold'
    },
    body: {
      large: 'text-base sm:text-lg',
      medium: 'text-sm sm:text-base',
      small: 'text-xs sm:text-sm'
    },
    button: {
      large: 'text-base sm:text-lg font-semibold',
      medium: 'text-sm sm:text-base font-semibold',
      small: 'text-xs sm:text-sm font-medium'
    }
  },

  // Color palette
  colors: {
    background: {
      primary: 'bg-slate-950',
      secondary: 'bg-slate-900',
      tertiary: 'bg-slate-800',
      gradient: {
        hero: 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900',
        cta: 'bg-gradient-to-br from-purple-600 to-pink-600',
        card: 'bg-white/5 backdrop-blur-sm'
      }
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-100',
      tertiary: 'text-gray-300',
      muted: 'text-gray-400',
      accent: 'text-purple-400'
    },
    gradient: {
      primary: 'from-purple-400 to-pink-400',
      secondary: 'from-blue-400 to-purple-400',
      accent: 'from-cyan-400 to-pink-400'
    },
    border: {
      default: 'border-white/10',
      hover: 'hover:border-purple-400/50',
      active: 'border-purple-500'
    }
  },

  // Button styles
  button: {
    primary: {
      base: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg transition-all shadow-lg',
      hover: 'hover:from-purple-600 hover:to-pink-600 hover:shadow-purple-500/50',
      size: {
        small: 'px-4 py-2',
        medium: 'px-6 sm:px-8 py-3 sm:py-4',
        large: 'px-8 sm:px-10 py-4 sm:py-5'
      }
    },
    secondary: {
      base: 'bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 transition-all',
      hover: 'hover:bg-white/20',
      size: {
        small: 'px-4 py-2',
        medium: 'px-6 sm:px-8 py-3 sm:py-4',
        large: 'px-8 sm:px-10 py-4 sm:py-5'
      }
    }
  },

  // Breakpoints (for reference in comments and media queries)
  breakpoints: {
    sm: '640px',   // Tablet
    md: '768px',   // Small laptop
    lg: '1024px',  // Desktop
    xl: '1280px',  // Large desktop
    '2xl': '1536px' // Extra large
  },

  // Container max widths
  container: {
    maxWidth: 'max-w-7xl mx-auto',
    padding: 'px-4 sm:px-6 lg:px-8'
  }
} as const;

/**
 * Helper function to combine theme classes
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Common component patterns
 */
export const components = {
  card: {
    base: cn(
      theme.colors.background.gradient.card,
      theme.spacing.card.padding,
      'rounded-lg',
      theme.colors.border.default,
      'border',
      theme.colors.border.hover,
      'hover:bg-white/10 transition-all group'
    ),
    title: cn(theme.typography.heading.h4, theme.colors.text.primary),
    description: cn(theme.typography.body.small, theme.colors.text.muted)
  },
  section: {
    base: cn(
      theme.spacing.section.paddingY.mobile,
      theme.spacing.section.paddingY.tablet,
      theme.spacing.section.paddingY.desktop
    ),
    container: cn(theme.container.maxWidth, theme.container.padding)
  },
  button: {
    primary: (size: 'small' | 'medium' | 'large' = 'medium') =>
      cn(
        theme.button.primary.base,
        theme.button.primary.hover,
        theme.button.primary.size[size],
        theme.typography.button.large
      ),
    secondary: (size: 'small' | 'medium' | 'large' = 'medium') =>
      cn(
        theme.button.secondary.base,
        theme.button.secondary.hover,
        theme.button.secondary.size[size],
        theme.typography.button.large
      )
  }
} as const;
