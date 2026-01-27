/**
 * NavigationTracker - Automatic Route Navigation Tracking
 *
 * Tracks route changes using Next.js router events.
 * Measures time spent on each page and tracks navigation methods.
 */

import type { NextRouter } from 'next/router';
import { Routes } from '@/architecture/Routes';
import type { ChatBubbleVariant } from '@supernal/interface-nextjs';
import type { NavigationEvent, PageViewEvent } from '../events/EventSchema';

export type TrackFunction = (event: NavigationEvent | PageViewEvent) => void;

export class NavigationTracker {
  private router: NextRouter;
  private trackFn: TrackFunction;
  private currentVariant: keyof typeof ChatBubbleVariant;
  private sessionId: string;
  private previousRoute: keyof typeof Routes | null = null;
  private routeStartTime: number = Date.now();
  private isInitialized = false;
  private isFirstPageView = true;

  constructor(
    router: NextRouter,
    trackFn: TrackFunction,
    currentVariant: keyof typeof ChatBubbleVariant,
    sessionId: string
  ) {
    this.router = router;
    this.trackFn = trackFn;
    this.currentVariant = currentVariant;
    this.sessionId = sessionId;
  }

  /**
   * Initialize navigation tracking
   */
  initialize(): void {
    if (this.isInitialized) return;

    // Track initial page load
    const currentRoute = this.getRouteKey(this.router.pathname) as any as keyof typeof Routes;
    this.trackPageView(currentRoute, this.isFirstPageView);
    this.trackNavigation(null, currentRoute, 'browser');
    this.previousRoute = currentRoute;
    this.isFirstPageView = false;

    // Listen for route changes
    this.router.events.on('routeChangeComplete', this.handleRouteChange.bind(this));
    this.router.events.on('routeChangeError', this.handleRouteError.bind(this));

    this.isInitialized = true;
  }

  /**
   * Update current variant
   */
  setVariant(variant: keyof typeof ChatBubbleVariant): void {
    this.currentVariant = variant;
  }

  /**
   * Update session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Get current route
   */
  getCurrentRoute(): keyof typeof Routes {
    return this.getRouteKey(this.router.pathname) as any as keyof typeof Routes;
  }

  /**
   * Handle route change event
   */
  private handleRouteChange(url: string): void {
    const toRoute = this.getRouteKey(url) as any as keyof typeof Routes;
    const duration = Date.now() - this.routeStartTime;

    // Determine navigation method
    const method = this.inferNavigationMethod();

    // Track navigation
    this.trackNavigation(this.previousRoute, toRoute, method, duration);

    // Track page view
    this.trackPageView(toRoute, false);

    // Update state
    this.previousRoute = toRoute;
    this.routeStartTime = Date.now();
  }

  /**
   * Handle route change error
   */
  private handleRouteError(err: Error, url: string): void {
    console.error('[NavigationTracker] Route change error:', err, url);
    // We don't track errors here, that's handled by ErrorTracker
  }

  /**
   * Infer navigation method based on browser history
   */
  private inferNavigationMethod(): 'link' | 'router' | 'browser' | 'back' | 'forward' {
    // Check if user clicked back/forward button
    // This is a heuristic - not 100% accurate but good enough
    if (typeof window !== 'undefined' && window.performance) {
      const navEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry && navEntry.type === 'back_forward') {
        return 'back';
      }
    }

    // Default to router (most common in Next.js SPA navigation)
    return 'router';
  }

  /**
   * Track navigation event
   */
  private trackNavigation(
    fromRoute: keyof typeof Routes | null,
    toRoute: keyof typeof Routes,
    method: 'link' | 'router' | 'ai' | 'browser' | 'back' | 'forward',
    duration?: number
  ): void {
    const event: NavigationEvent = {
      event: 'navigation',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route: toRoute,
      variant: this.currentVariant,
      fromRoute,
      toRoute,
      method,
      duration,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    this.trackFn(event);
  }

  /**
   * Track page view event
   */
  private trackPageView(route: keyof typeof Routes, landingPage: boolean): void {
    const event: PageViewEvent = {
      event: 'page_view',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route,
      variant: this.currentVariant,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      landingPage,
    };

    this.trackFn(event);
  }

  /**
   * Map pathname to Routes key
   */
  private getRouteKey(pathname: string): keyof typeof Routes {
    // Import Routes dynamically to avoid circular dependency
    // In production, this would be pre-computed
    const routesModule = require('@/architecture/Routes');
    const Routes = routesModule.Routes;

    // Remove query string and hash
    const cleanPath = pathname.split('?')[0].split('#')[0];

    // Find matching route
    const routeEntry = Object.entries(Routes).find(([_, value]) => {
      if (typeof value === 'function') {
        // Dynamic route - try to match pattern
        // This is simplified - real implementation would use route matching
        return false;
      }
      return value === cleanPath;
    });

    // Return route key or default to 'root'
    return (routeEntry?.[0] || 'root') as keyof typeof Routes;
  }
}
