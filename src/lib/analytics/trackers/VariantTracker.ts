/**
 * VariantTracker - ChatBubbleVariant Change Tracking
 *
 * Tracks when users switch between chat bubble variants (full, floating, drawer, subtitle).
 * Monitors URL parameters, localStorage changes, and A/B experiment assignments.
 */

import type { NextRouter } from 'next/router';
import { Routes } from '@/architecture/Routes';
import { ChatBubbleVariant } from '@supernal/interface-nextjs';
import type { VariantChangeEvent } from '../events/EventSchema';

type ChatBubbleVariantType = keyof typeof ChatBubbleVariant;

export type TrackFunction = (event: VariantChangeEvent) => void;

export class VariantTracker {
  private router: NextRouter;
  private trackFn: TrackFunction;
  private currentRoute: keyof typeof Routes;
  private currentVariant: ChatBubbleVariantType;
  private sessionId: string;
  private isInitialized = false;

  constructor(
    router: NextRouter,
    trackFn: TrackFunction,
    currentRoute: keyof typeof Routes,
    initialVariant: ChatBubbleVariantType,
    sessionId: string
  ) {
    this.router = router;
    this.trackFn = trackFn;
    this.currentRoute = currentRoute;
    this.currentVariant = initialVariant;
    this.sessionId = sessionId;
  }

  /**
   * Initialize variant change tracking
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    // Monitor URL parameter changes
    this.router.events.on('routeChangeComplete', this.handleRouteChange.bind(this));

    // Monitor localStorage changes (cross-tab communication)
    window.addEventListener('storage', this.handleStorageChange.bind(this));

    this.isInitialized = true;
  }

  /**
   * Get current variant
   */
  getCurrentVariant(): ChatBubbleVariantType {
    return this.currentVariant;
  }

  /**
   * Update current route
   */
  setRoute(route: keyof typeof Routes): void {
    this.currentRoute = route;
  }

  /**
   * Update session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Track manual variant change (e.g., from DevVariantSwitcher)
   */
  trackManualChange(
    fromVariant: ChatBubbleVariantType,
    toVariant: ChatBubbleVariantType
  ): void {
    this.trackVariantChange(fromVariant, toVariant, 'manual');
    this.currentVariant = toVariant;
  }

  /**
   * Track experiment-driven variant change (A/B testing)
   */
  trackExperimentChange(
    fromVariant: ChatBubbleVariantType,
    toVariant: ChatBubbleVariantType,
    experimentId: string
  ): void {
    this.trackVariantChange(fromVariant, toVariant, 'experiment', experimentId);
    this.currentVariant = toVariant;
  }

  /**
   * Handle route change (check URL parameter)
   */
  private handleRouteChange(): void {
    const variantParam = this.router.query.variant as string | undefined;

    if (variantParam && this.isValidVariant(variantParam)) {
      const newVariant = variantParam as ChatBubbleVariantType;

      if (newVariant !== this.currentVariant) {
        this.trackVariantChange(
          this.currentVariant,
          newVariant,
          'url'
        );
        this.currentVariant = newVariant;
      }
    }
  }

  /**
   * Handle localStorage change (cross-tab sync)
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'chat-variant' && event.newValue) {
      const newVariant = event.newValue;

      if (this.isValidVariant(newVariant) && newVariant !== this.currentVariant) {
        this.trackVariantChange(
          this.currentVariant,
          newVariant as ChatBubbleVariantType,
          'storage'
        );
        this.currentVariant = newVariant as ChatBubbleVariantType;
      }
    }
  }

  /**
   * Check if variant is valid
   */
  private isValidVariant(variant: string): boolean {
    const validVariants = ['full', 'floating', 'drawer', 'subtitle'];
    return validVariants.includes(variant);
  }

  /**
   * Track variant change event
   */
  private trackVariantChange(
    fromVariant: ChatBubbleVariantType,
    toVariant: ChatBubbleVariantType,
    method: 'manual' | 'url' | 'storage' | 'experiment',
    experimentId?: string
  ): void {
    // Import ChatBubbleVariant to get keys
    const { ChatBubbleVariant } = require('@supernal/interface-nextjs');

    // @ts-ignore - TypeScript has issues with variant type narrowing
    const event: VariantChangeEvent = {
      event: 'variant_change',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      route: this.currentRoute,
      variant: toVariant,
      fromVariant: fromVariant,
      toVariant: toVariant,
      method,
      experimentId,
    };

    this.trackFn(event);
  }
}
