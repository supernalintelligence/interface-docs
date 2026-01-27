/**
 * Analytics Manager - Unified Analytics System
 *
 * Orchestrates all analytics providers (GTM, PostHog, Console) and trackers
 * (Component, Tool, Navigation, Variant) for automatic event tracking.
 *
 * Key Features:
 * - Dual tracking: GTM + PostHog
 * - Automatic tracking via global event delegation
 * - Named contracts integration (Routes, Components, ChatBubbleVariant)
 * - Session management
 * - Consent management (GDPR)
 */

import type { NextRouter } from 'next/router';
import type { AnalyticsConfig, IAnalyticsProvider } from './AnalyticsProvider';
import type { AnalyticsEvent } from './events/EventSchema';
import { ChatBubbleVariant } from '@supernal/interface-nextjs';
import { Routes } from '@/architecture/Routes';

type ChatBubbleVariantType = keyof typeof ChatBubbleVariant;

import { GTMProvider } from './providers/GTMProvider';
import { PostHogProvider } from './providers/PostHogProvider';
import { ConsoleProvider } from './providers/ConsoleProvider';
import { ComponentTracker } from './trackers/ComponentTracker';
import { ToolTracker } from './trackers/ToolTracker';
import { NavigationTracker } from './trackers/NavigationTracker';
import { VariantTracker } from './trackers/VariantTracker';

/**
 * Analytics Manager - Singleton
 */
class AnalyticsManager {
  private providers: IAnalyticsProvider[] = [];
  private componentTracker?: ComponentTracker;
  private toolTracker?: ToolTracker;
  private navigationTracker?: NavigationTracker;
  private variantTracker?: VariantTracker;
  private sessionId: string = '';
  private initialized = false;
  private config?: AnalyticsConfig;

  /**
   * Initialize analytics system
   */
  async initialize(config: AnalyticsConfig, router: NextRouter): Promise<void> {
    if (this.initialized) {
      console.warn('[Analytics] Already initialized');
      return;
    }

    this.config = config;
    this.sessionId = this.generateSessionId();

    // Initialize providers
    await this.initializeProviders(config);

    // Initialize trackers
    await this.initializeTrackers(config, router);

    this.initialized = true;

    if (config.debug) {
      console.log('[Analytics] Initialized successfully', {
        providers: this.providers.map((p) => p.name),
        sessionId: this.sessionId,
      });
    }
  }

  /**
   * Track an analytics event
   */
  track(event: AnalyticsEvent): void {
    if (!this.initialized) {
      console.warn('[Analytics] Not initialized, queueing event:', event.event);
      // TODO: Implement offline queue
      return;
    }

    // Send to all providers in parallel
    Promise.all(
      this.providers.map((provider) => provider.track(event))
    ).catch((error) => {
      console.error('[Analytics] Error tracking event:', error);
    });
  }

  /**
   * Identify user
   */
  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    if (!this.initialized) return;

    await Promise.all(
      this.providers.map((provider) => provider.identify(userId, traits))
    );
  }

  /**
   * Reset user identification (logout)
   */
  async reset(): Promise<void> {
    if (!this.initialized) return;

    await Promise.all(
      this.providers.map((provider) => provider.reset())
    );

    // Generate new session ID
    this.sessionId = this.generateSessionId();
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Check if analytics is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get PostHog provider (for feature flags, experiments)
   */
  getPostHogProvider(): PostHogProvider | undefined {
    return this.providers.find((p) => p.name === 'PostHog') as PostHogProvider | undefined;
  }

  /**
   * Initialize all providers
   */
  private async initializeProviders(config: AnalyticsConfig): Promise<void> {
    const providerPromises: Promise<void>[] = [];

    // GTM Provider
    if (config.providers.gtm?.enabled) {
      const gtm = new GTMProvider();
      providerPromises.push(gtm.initialize(config));
      this.providers.push(gtm);
    }

    // PostHog Provider
    if (config.providers.posthog?.enabled) {
      const posthog = new PostHogProvider();
      providerPromises.push(posthog.initialize(config));
      this.providers.push(posthog);
    }

    // Console Provider
    if (config.providers.console?.enabled) {
      const console = new ConsoleProvider();
      providerPromises.push(console.initialize(config));
      this.providers.push(console);
    }

    // Wait for all providers to initialize
    await Promise.all(providerPromises);

    if (config.debug) {
      console.log('[Analytics] Providers initialized:', this.providers.map((p) => p.name));
    }
  }

  /**
   * Initialize all trackers
   */
  private async initializeTrackers(config: AnalyticsConfig, router: NextRouter): Promise<void> {
    // Get initial route and variant
    const initialRoute = this.getRouteKeyFromPathname(router.pathname) as any as keyof typeof Routes;
    const initialVariant = this.getInitialVariant(router);

    // Track function that all trackers will use
    const trackFn = this.track.bind(this);

    // Component Tracker
    this.componentTracker = new ComponentTracker(
      trackFn,
      initialRoute,
      initialVariant,
      this.sessionId
    );
    this.componentTracker.initialize();

    // Tool Tracker
    this.toolTracker = new ToolTracker(
      trackFn,
      initialRoute,
      initialVariant,
      this.sessionId
    );
    this.toolTracker.initialize();

    // Navigation Tracker
    this.navigationTracker = new NavigationTracker(
      router,
      trackFn,
      initialVariant,
      this.sessionId
    );
    this.navigationTracker.initialize();

    // Variant Tracker
    this.variantTracker = new VariantTracker(
      router,
      trackFn,
      initialRoute,
      initialVariant,
      this.sessionId
    );
    this.variantTracker.initialize();

    // Cross-update trackers when route/variant changes
    this.setupTrackerUpdates();

    if (config.debug) {
      console.log('[Analytics] Trackers initialized');
    }
  }

  /**
   * Setup automatic updates between trackers
   */
  private setupTrackerUpdates(): void {
    // When navigation changes, update all trackers with new route
    if (this.navigationTracker) {
      const originalTrackFn = this.navigationTracker['trackFn'];
      this.navigationTracker['trackFn'] = (event: AnalyticsEvent) => {
        if (event.event === 'navigation') {
          const navEvent = event as import('./events/EventSchema').NavigationEvent;
          const newRoute = navEvent.toRoute;
          this.componentTracker?.setRoute(newRoute);
          this.toolTracker?.setRoute(newRoute);
          this.variantTracker?.setRoute(newRoute);
        }
        originalTrackFn(event as any);
      };
    }

    // When variant changes, update all trackers with new variant
    if (this.variantTracker) {
      const originalTrackFn = this.variantTracker['trackFn'];
      this.variantTracker['trackFn'] = (event: AnalyticsEvent) => {
        if (event.event === 'variant_change') {
          const variantEvent = event as import('./events/EventSchema').VariantChangeEvent;
          const newVariant = variantEvent.toVariant;
          const variantTypeKey = newVariant as ChatBubbleVariantType;
          this.componentTracker?.setVariant(variantTypeKey);
          this.toolTracker?.setVariant(variantTypeKey);
          this.navigationTracker?.setVariant(variantTypeKey);
        }
        originalTrackFn(event as any);
      };
    }
  }

  /**
   * Get initial variant from URL or localStorage
   */
  private getInitialVariant(router: NextRouter): ChatBubbleVariantType {
    const variantParam = router.query.variant as string | undefined;
    if (variantParam) {
      return variantParam as ChatBubbleVariantType;
    }

    if (typeof window !== 'undefined') {
      const savedVariant = localStorage.getItem('chat-variant');
      if (savedVariant) {
        return savedVariant as ChatBubbleVariantType;
      }
    }

    return 'full';
  }

  /**
   * Get route key from pathname
   */
  private getRouteKeyFromPathname(pathname: string): keyof typeof Routes {
    // Import Routes dynamically
    const routesModule = require('@/architecture/Routes');
    const Routes = routesModule.Routes;

    const cleanPath = pathname.split('?')[0].split('#')[0];

    const routeEntry = Object.entries(Routes).find(([_, value]) => {
      if (typeof value === 'function') {
        return false;
      }
      return value === cleanPath;
    });

    const routeKey = routeEntry?.[0] || 'root';
    return routeKey as keyof typeof Routes;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${timestamp}_${random}`;
  }
}

// Singleton instance
const analytics = new AnalyticsManager();

console.log('[Analytics Module] Loaded (SSR or client)');

// Public API
export async function initializeAnalytics(config: AnalyticsConfig, router: NextRouter): Promise<void> {
  console.log('[Analytics Module] initializeAnalytics called');
  return analytics.initialize(config, router);
}

export function track(event: AnalyticsEvent): void {
  analytics.track(event);
}

export async function identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
  return analytics.identify(userId, traits);
}

export async function reset(): Promise<void> {
  return analytics.reset();
}

export function getSessionId(): string {
  return analytics.getSessionId();
}

export function isInitialized(): boolean {
  return analytics.isInitialized();
}

export function getPostHogProvider(): PostHogProvider | undefined {
  return analytics.getPostHogProvider();
}

// Re-export types
export type { AnalyticsConfig, AnalyticsEvent };
export * from './events/EventSchema';
export type {
  IAnalyticsProvider,
  GTMConfig,
  PostHogConfig,
  ConsoleConfig,
  ConsentConfig,
  PerformanceConfig,
  ProviderFactory,
  EventFilter,
  EventTransformer
} from './AnalyticsProvider';
