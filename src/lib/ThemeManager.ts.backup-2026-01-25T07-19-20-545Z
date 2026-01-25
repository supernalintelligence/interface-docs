/**
 * Global Theme Manager
 * Manages theme state across all pages and persists to localStorage
 */

export type Theme = 'light' | 'dark' | 'auto';

class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: Theme = 'light';
  private listeners: Set<(theme: Theme) => void> = new Set();

  private constructor() {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('supernal-theme');
      if (stored && ['light', 'dark', 'auto'].includes(stored)) {
        this.currentTheme = stored as Theme;
      }
      this.applyTheme(this.currentTheme);
      
      // Listen for system theme changes when in auto mode
      if (typeof window.matchMedia !== 'undefined') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          if (this.currentTheme === 'auto') {
            this.applyTheme('auto');
          }
        });
      }
    }
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  getTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    localStorage.setItem('supernal-theme', theme);
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(theme));
  }

  private applyTheme(theme: Theme) {
    if (typeof document === 'undefined') return;
    
    let effectiveTheme: 'light' | 'dark' = 'light';
    
    // Handle 'auto' by detecting system preference
    if (theme === 'auto') {
      if (typeof window.matchMedia !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        effectiveTheme = prefersDark ? 'dark' : 'light';
      }
    } else {
      effectiveTheme = theme;
    }
    
    // Apply to document root
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Also apply as class for easier CSS targeting
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${effectiveTheme}`);
  }

  subscribe(listener: (theme: Theme) => void): () => void {
    this.listeners.add(listener);
    // Call immediately with current theme
    listener(this.currentTheme);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }
}

export const themeManager = ThemeManager.getInstance();

