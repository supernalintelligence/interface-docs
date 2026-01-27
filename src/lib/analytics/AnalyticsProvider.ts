/**
 * Analytics Provider Interface - Contract for all analytics providers
 *
 * All providers (GTM, PostHog, Console) must implement this interface
 * to ensure consistent behavior and easy extensibility.
 */

import type { AnalyticsEvent } from './events/EventSchema';

/**
 * Analytics Provider Interface
 *
 * Providers must implement these methods to be compatible with AnalyticsManager
 */
export interface IAnalyticsProvider {
  /** Provider name (e.g., 'GTM', 'PostHog', 'Console') */
  readonly name: string;

  /** Initialize the provider with configuration */
  initialize(config: AnalyticsConfig): Promise<void>;

  /** Track an analytics event */
  track(event: AnalyticsEvent): Promise<void>;

  /** Identify a user with ID and traits */
  identify(userId: string, traits?: Record<string, unknown>): Promise<void>;

  /** Reset user identification (logout) */
  reset(): Promise<void>;

  /** Check if provider is ready to track events */
  isReady(): boolean;
}

/**
 * Analytics Configuration
 */
export interface AnalyticsConfig {
  /** Provider-specific configurations */
  providers: {
    gtm?: GTMConfig;
    posthog?: PostHogConfig;
    console?: ConsoleConfig;
  };

  /** Consent management (GDPR compliance) */
  consent: ConsentConfig;

  /** Performance optimization settings */
  performance: PerformanceConfig;

  /** Debug mode (enables verbose logging) */
  debug: boolean;
}

/**
 * Google Tag Manager Configuration
 */
export interface GTMConfig {
  containerId: string;              // GTM container ID (GTM-XXXXXXX)
  enabled: boolean;                 // Enable/disable GTM tracking
  dataLayerName?: string;           // Custom dataLayer name (default: 'dataLayer')
}

/**
 * PostHog Configuration
 */
export interface PostHogConfig {
  apiKey: string;                   // PostHog API key
  host?: string;                    // PostHog host (default: https://app.posthog.com)
  enabled: boolean;                 // Enable/disable PostHog tracking
  sessionReplay?: boolean;          // Enable session replay (privacy-sensitive)
  capturePageView?: boolean;        // Auto-capture page views
  autocapture?: boolean;            // Auto-capture element interactions
  maskAllInputs?: boolean;          // Mask all input values in session replay
}

/**
 * Console Provider Configuration
 */
export interface ConsoleConfig {
  enabled: boolean;                 // Enable/disable console logging
  verboseEvents?: string[];         // Event types to log verbosely
  groupBySession?: boolean;         // Group logs by session ID
}

/**
 * Consent Configuration (GDPR)
 */
export interface ConsentConfig {
  required: boolean;                // Is consent required?
  defaultState: 'granted' | 'denied' | 'pending'; // Default consent state
  storageKey?: string;              // localStorage key for consent state
}

/**
 * Performance Configuration
 */
export interface PerformanceConfig {
  batchEnabled: boolean;            // Enable event batching
  batchSize: number;                // Max events per batch
  batchInterval: number;            // Batch interval (milliseconds)
  offlineQueue: boolean;            // Queue events when offline
  maxQueueSize?: number;            // Max queued events (default: 100)
}

/**
 * Provider factory type
 */
export type ProviderFactory = (config: AnalyticsConfig) => IAnalyticsProvider;

/**
 * Analytics event filter - allows selective tracking
 */
export type EventFilter = (event: AnalyticsEvent) => boolean;

/**
 * Analytics event transformer - allows event modification before sending
 */
export type EventTransformer = (event: AnalyticsEvent) => AnalyticsEvent;
