/**
 * GTMProvider - Google Tag Manager Analytics Provider
 *
 * Wraps existing window.gtag functionality and maps our event schema to GTM format.
 * Compatible with the existing GTM integration in _app.tsx.
 */

import type { IAnalyticsProvider } from '../AnalyticsProvider';
import type { AnalyticsConfig } from '../AnalyticsProvider';
import type { AnalyticsEvent } from '../events/EventSchema';

// Extend Window interface for GTM
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export class GTMProvider implements IAnalyticsProvider {
  readonly name = 'GTM';
  private ready = false;
  private containerId: string = '';
  private dataLayerName: string = 'dataLayer';

  async initialize(config: AnalyticsConfig): Promise<void> {
    const { containerId, enabled, dataLayerName } = config.providers.gtm || {};

    if (!enabled || !containerId) {
      console.warn('[GTM] Disabled or missing container ID');
      return;
    }

    this.containerId = containerId;
    this.dataLayerName = dataLayerName || 'dataLayer';

    // Check if GTM is already initialized (by _app.tsx)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      this.ready = true;
      if (config.debug) {
        console.log(`[GTM] Already initialized with container ${containerId}`);
      }
      return;
    }

    // If not initialized, wait a bit for _app.tsx to load it
    await this.waitForGTM();

    this.ready = typeof window !== 'undefined' && typeof window.gtag === 'function';

    if (this.ready && config.debug) {
      console.log(`[GTM] Initialized with container ${containerId}`);
    } else if (!this.ready) {
      console.warn('[GTM] Failed to initialize - gtag not found');
    }
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.ready) {
      console.warn('[GTM] Not ready, skipping event:', event.event);
      return;
    }

    // Map our event schema to GTM format
    const gtmEvent = this.mapEventToGTM(event);

    // Send to GTM
    window.gtag('event', gtmEvent.action, gtmEvent.params);
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    if (!this.ready) return;

    // GTM user identification
    window.gtag('config', this.containerId, {
      user_id: userId,
      ...traits
    });
  }

  async reset(): Promise<void> {
    // GTM doesn't have a built-in reset method
    // We clear user_id by setting it to undefined
    if (this.ready) {
      window.gtag('config', this.containerId, {
        user_id: undefined
      });
    }
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * Wait for GTM to be loaded by _app.tsx
   */
  private async waitForGTM(): Promise<void> {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 10;

      const check = () => {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          resolve();
        } else if (attempts++ < maxAttempts) {
          setTimeout(check, 100);
        } else {
          console.warn('[GTM] Timeout waiting for gtag');
          resolve();
        }
      };

      check();
    });
  }

  /**
   * Map AnalyticsEvent to GTM format
   */
  private mapEventToGTM(event: AnalyticsEvent): {
    action: string;
    params: Record<string, unknown>;
  } {
    const baseParams = {
      event_category: this.getCategoryForEvent(event.event),
      timestamp: event.timestamp,
      session_id: event.sessionId,
      user_id: event.userId,
      route: event.route,
      variant: event.variant
    };

    switch (event.event) {
      case 'component_interaction':
        return {
          action: 'component_interaction',
          params: {
            ...baseParams,
            component: event.component,
            action: event.action,
            value: event.value,
            target_tag: event.target?.tagName,
            target_class: event.target?.className
          }
        };

      case 'tool_execution':
        return {
          action: 'tool_execution',
          params: {
            ...baseParams,
            tool_id: event.toolId,
            tool_name: event.toolName,
            component: event.component,
            method: event.method,
            success: event.success,
            duration: event.duration,
            error: event.error
          }
        };

      case 'navigation':
        return {
          action: 'navigation',
          params: {
            ...baseParams,
            from_route: event.fromRoute,
            to_route: event.toRoute,
            method: event.method,
            duration: event.duration,
            referrer: event.referrer
          }
        };

      case 'variant_change':
        return {
          action: 'variant_change',
          params: {
            ...baseParams,
            from_variant: event.fromVariant,
            to_variant: event.toVariant,
            method: event.method,
            experiment_id: event.experimentId
          }
        };

      case 'page_view':
        return {
          action: 'page_view',
          params: {
            ...baseParams,
            page_title: event.title,
            referrer: event.referrer,
            landing_page: event.landingPage
          }
        };

      case 'engagement':
        return {
          action: 'engagement',
          params: {
            ...baseParams,
            engagement_type: event.type,
            value: event.value,
            target: event.target
          }
        };

      case 'feedback_submitted':
      case 'component_feedback':
      case 'nps_score':
      case 'rating':
        return {
          action: event.event,
          params: {
            ...baseParams,
            feedback_type: event.feedbackType,
            helpful: event.helpful,
            score: event.score,
            has_comment: event.hasComment,
            component_id: event.componentId,
            context: event.context
          }
        };

      case 'cookie_consent':
        return {
          action: 'cookie_consent',
          params: {
            ...baseParams,
            accepted: event.accepted,
            consent_type: event.consentType
          }
        };

      case 'error':
        return {
          action: 'error',
          params: {
            ...baseParams,
            error_type: event.errorType,
            message: event.message,
            stack: event.stack,
            severity: event.severity
          }
        };

      default:
        // Fallback for unknown event types
        return {
          action: event.event,
          params: {
            ...baseParams,
            ...event.metadata
          }
        };
    }
  }

  /**
   * Get event category for grouping in GTM
   */
  private getCategoryForEvent(eventType: string): string {
    const categoryMap: Record<string, string> = {
      component_interaction: 'interaction',
      tool_execution: 'tool_usage',
      navigation: 'navigation',
      variant_change: 'variant',
      page_view: 'page',
      engagement: 'engagement',
      feedback_submitted: 'feedback',
      component_feedback: 'feedback',
      nps_score: 'feedback',
      rating: 'feedback',
      cookie_consent: 'privacy',
      error: 'error'
    };

    return categoryMap[eventType] || 'general';
  }
}
