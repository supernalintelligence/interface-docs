/**
 * PostHogProvider - PostHog Analytics Provider
 *
 * Integrates PostHog SDK for advanced analytics, feature flags, and A/B testing.
 * Includes session replay support (opt-in for privacy).
 */

import posthog from 'posthog-js';
import type { IAnalyticsProvider } from '../AnalyticsProvider';
import type { AnalyticsConfig } from '../AnalyticsProvider';
import type { AnalyticsEvent } from '../events/EventSchema';

export class PostHogProvider implements IAnalyticsProvider {
  readonly name = 'PostHog';
  private ready = false;

  async initialize(config: AnalyticsConfig): Promise<void> {
    const {
      apiKey,
      host,
      enabled,
      sessionReplay,
      capturePageView,
      autocapture,
      maskAllInputs
    } = config.providers.posthog || {};

    if (!enabled || !apiKey) {
      console.warn('[PostHog] Disabled or missing API key');
      return;
    }

    // Initialize PostHog
    posthog.init(apiKey, {
      api_host: host || 'https://app.posthog.com',
      autocapture: autocapture ?? false,  // Disable autocapture (we track manually)
      capture_pageview: capturePageView ?? false, // Disable auto page views
      // Session recording config (simplified for posthog-js v1.335+)
      ...(sessionReplay && {
        session_recording: {
          maskAllInputs: maskAllInputs ?? true, // Privacy: mask inputs by default
          maskTextSelector: '[data-sensitive]', // Custom masking selector
        }
      }),
      loaded: (posthogInstance) => {
        this.ready = true;
        if (config.debug) {
          console.log('[PostHog] Initialized');
          posthogInstance.debug();
        }
      },
    });
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.ready) {
      console.warn('[PostHog] Not ready, skipping event:', event.event);
      return;
    }

    // Map our event schema to PostHog format
    const properties = this.mapEventToPostHog(event);

    // Send to PostHog
    posthog.capture(event.event, properties);
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    if (!this.ready) return;

    posthog.identify(userId, traits);
  }

  async reset(): Promise<void> {
    if (!this.ready) return;

    posthog.reset();
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * PostHog-specific: Get feature flag value
   */
  getFeatureFlag(key: string): boolean | string | undefined {
    if (!this.ready) return undefined;

    return posthog.getFeatureFlag(key);
  }

  /**
   * PostHog-specific: Check if feature flag is enabled
   */
  isFeatureFlagEnabled(key: string): boolean {
    if (!this.ready) return false;

    return posthog.isFeatureEnabled(key) ?? false;
  }

  /**
   * PostHog-specific: Track experiment assignment
   */
  async trackExperiment(experimentId: string, variant: string): Promise<void> {
    if (!this.ready) return;

    posthog.capture('$experiment_started', {
      $experiment_id: experimentId,
      $feature_flag: experimentId,
      $feature_flag_response: variant,
    });
  }

  /**
   * PostHog-specific: Set user properties
   */
  setUserProperties(properties: Record<string, unknown>): void {
    if (!this.ready) return;

    posthog.people.set(properties);
  }

  /**
   * Map AnalyticsEvent to PostHog properties format
   */
  private mapEventToPostHog(event: AnalyticsEvent): Record<string, unknown> {
    const baseProperties = {
      timestamp: event.timestamp,
      session_id: event.sessionId,
      user_id: event.userId,
      route: event.route,
      variant: event.variant,
      $current_url: typeof window !== 'undefined' ? window.location.href : undefined,
      $referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    };

    switch (event.event) {
      case 'component_interaction':
        return {
          ...baseProperties,
          component: event.component,
          action: event.action,
          value: event.value,
          target_tag: event.target?.tagName,
          target_class: event.target?.className,
          target_id: event.target?.id,
        };

      case 'tool_execution':
        return {
          ...baseProperties,
          tool_id: event.toolId,
          tool_name: event.toolName,
          component: event.component,
          method: event.method,
          success: event.success,
          duration: event.duration,
          error: event.error,
          parameters: event.parameters,
        };

      case 'navigation':
        return {
          ...baseProperties,
          from_route: event.fromRoute,
          to_route: event.toRoute,
          method: event.method,
          duration: event.duration,
          referrer: event.referrer,
        };

      case 'variant_change':
        return {
          ...baseProperties,
          from_variant: event.fromVariant,
          to_variant: event.toVariant,
          method: event.method,
          experiment_id: event.experimentId,
        };

      case 'page_view':
        return {
          ...baseProperties,
          page_title: event.title,
          referrer: event.referrer,
          landing_page: event.landingPage,
        };

      case 'engagement':
        return {
          ...baseProperties,
          engagement_type: event.type,
          value: event.value,
          target: event.target,
        };

      case 'feedback_submitted':
      case 'component_feedback':
      case 'nps_score':
      case 'rating':
        return {
          ...baseProperties,
          feedback_type: event.feedbackType,
          helpful: event.helpful,
          score: event.score,
          has_comment: event.hasComment,
          component_id: event.componentId,
          context: event.context,
        };

      case 'cookie_consent':
        return {
          ...baseProperties,
          accepted: event.accepted,
          consent_type: event.consentType,
        };

      case 'error':
        return {
          ...baseProperties,
          error_type: event.errorType,
          message: event.message,
          stack: event.stack,
          severity: event.severity,
        };

      default:
        // TypeScript thinks event is never here because all cases are handled
        // but we keep this for extensibility
        return {
          ...baseProperties,
          ...(event as any).metadata,
        };
    }
  }
}
