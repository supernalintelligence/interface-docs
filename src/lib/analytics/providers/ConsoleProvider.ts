/**
 * ConsoleProvider - Development Console Logging Provider
 *
 * Pretty-prints analytics events to the console during development.
 * Helps with debugging and understanding event flow.
 */

import type { IAnalyticsProvider } from '../AnalyticsProvider';
import type { AnalyticsConfig } from '../AnalyticsProvider';
import type { AnalyticsEvent } from '../events/EventSchema';

export class ConsoleProvider implements IAnalyticsProvider {
  readonly name = 'Console';
  private ready = false;
  private verboseEvents: Set<string> = new Set();
  private groupBySession = false;
  private sessionGroups = new Map<string, number>();

  async initialize(config: AnalyticsConfig): Promise<void> {
    const { enabled, verboseEvents, groupBySession } = config.providers.console || {};

    if (!enabled) {
      console.log('[Console] Analytics logging disabled');
      return;
    }

    this.ready = true;
    this.verboseEvents = new Set(verboseEvents || []);
    this.groupBySession = groupBySession ?? false;

    console.log('[Console] Analytics logging enabled', {
      verbose: verboseEvents?.length ? verboseEvents : 'all events',
      groupBySession: this.groupBySession
    });
  }

  async track(event: AnalyticsEvent): Promise<void> {
    if (!this.ready) return;

    const isVerbose = this.verboseEvents.size === 0 || this.verboseEvents.has(event.event);

    if (isVerbose) {
      this.logEvent(event);
    } else {
      // Non-verbose: Just show event name
      console.log(this.getEmoji(event.event), `[Analytics] ${event.event}`);
    }
  }

  async identify(userId: string, traits?: Record<string, unknown>): Promise<void> {
    if (!this.ready) return;

    console.log('👤 [Analytics] User identified:', { userId, traits });
  }

  async reset(): Promise<void> {
    if (!this.ready) return;

    console.log('🔄 [Analytics] User reset (logged out)');
    this.sessionGroups.clear();
  }

  isReady(): boolean {
    return this.ready;
  }

  /**
   * Log event with pretty formatting
   */
  private logEvent(event: AnalyticsEvent): void {
    const emoji = this.getEmoji(event.event);
    const timestamp = new Date(event.timestamp).toLocaleTimeString();

    if (this.groupBySession) {
      this.logWithSessionGroup(event, emoji, timestamp);
    } else {
      this.logStandalone(event, emoji, timestamp);
    }
  }

  /**
   * Log event in a session group
   */
  private logWithSessionGroup(event: AnalyticsEvent, emoji: string, timestamp: string): void {
    const sessionId = event.sessionId;

    if (!this.sessionGroups.has(sessionId)) {
      this.sessionGroups.set(sessionId, Date.now());
      console.group(`🎯 Session: ${sessionId.slice(0, 8)}...`);
    }

    console.log(`${emoji} [${timestamp}] ${event.event}`, this.getEventDetails(event));
  }

  /**
   * Log event standalone (not grouped)
   */
  private logStandalone(event: AnalyticsEvent, emoji: string, timestamp: string): void {
    const details = this.getEventDetails(event);

    console.groupCollapsed(`${emoji} [Analytics] ${event.event} (${timestamp})`);
    console.table(details);
    console.log('Full event:', event);
    console.groupEnd();
  }

  /**
   * Extract relevant details from event for logging
   */
  private getEventDetails(event: AnalyticsEvent): Record<string, unknown> {
    const base = {
      route: event.route,
      variant: event.variant,
      sessionId: event.sessionId.slice(0, 8) + '...',
    };

    switch (event.event) {
      case 'component_interaction':
        return {
          ...base,
          component: event.component,
          action: event.action,
          value: event.value,
        };

      case 'tool_execution':
        return {
          ...base,
          tool: event.toolId,
          method: event.method,
          success: event.success,
          duration: event.duration ? `${event.duration}ms` : undefined,
        };

      case 'navigation':
        return {
          ...base,
          from: event.fromRoute || 'initial',
          to: event.toRoute,
          method: event.method,
          timeOnPage: event.duration ? `${(event.duration / 1000).toFixed(1)}s` : undefined,
        };

      case 'variant_change':
        return {
          ...base,
          from: event.fromVariant,
          to: event.toVariant,
          method: event.method,
          experiment: event.experimentId,
        };

      case 'page_view':
        return {
          ...base,
          title: event.title,
          landing: event.landingPage,
        };

      case 'engagement':
        return {
          ...base,
          type: event.type,
          value: event.value,
        };

      case 'feedback_submitted':
      case 'component_feedback':
      case 'nps_score':
      case 'rating':
        return {
          ...base,
          type: event.feedbackType,
          score: event.score,
          helpful: event.helpful,
        };

      case 'cookie_consent':
        return {
          ...base,
          accepted: event.accepted,
        };

      case 'error':
        return {
          ...base,
          type: event.errorType,
          message: event.message,
          severity: event.severity,
        };

      default:
        return base;
    }
  }

  /**
   * Get emoji for event type
   */
  private getEmoji(eventType: string): string {
    const emojiMap: Record<string, string> = {
      component_interaction: '🖱️',
      tool_execution: '🔧',
      navigation: '🧭',
      variant_change: '🔄',
      page_view: '📄',
      engagement: '📊',
      feedback_submitted: '💬',
      component_feedback: '👍',
      nps_score: '⭐',
      rating: '📈',
      cookie_consent: '🍪',
      error: '❌',
    };

    return emojiMap[eventType] || '📡';
  }
}
