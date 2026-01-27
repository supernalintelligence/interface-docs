/**
 * useAnalyticsInit - React Hook for Analytics Initialization
 *
 * Initializes the analytics system in _app.tsx with the correct configuration.
 * Handles environment variables and ensures analytics is initialized once.
 */

import { useEffect } from 'react';
import type { NextRouter } from 'next/router';

export function useAnalyticsInit(router: NextRouter): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const config = {
      providers: {
        gtm: {
          containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || '',
          enabled: !!process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
          dataLayerName: 'dataLayer',
        },
        posthog: {
          apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY || '',
          host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
          enabled: !!process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
          sessionReplay: process.env.NEXT_PUBLIC_POSTHOG_SESSION_REPLAY === 'true',
          capturePageView: false, // We track page views manually via NavigationTracker
          autocapture: false, // We track interactions manually via ComponentTracker
          maskAllInputs: true, // Privacy: mask all inputs in session replay
        },
        console: {
          enabled: process.env.NODE_ENV === 'development',
          verboseEvents: [], // Empty = log all events
          groupBySession: false,
        },
      },
      consent: {
        required: true,
        defaultState: 'granted' as const, // Or 'pending' for strict GDPR
        storageKey: 'supernal-cookie-consent',
      },
      performance: {
        batchEnabled: false, // Disabled for now (can enable later for optimization)
        batchSize: 10,
        batchInterval: 5000,
        offlineQueue: false, // Disabled for now (can enable later)
        maxQueueSize: 100,
      },
      debug: process.env.NODE_ENV === 'development',
    };

    // Dynamically import and initialize analytics
    // This avoids TypeScript errors with the import at compile time
    import('@/lib/analytics')
      .then((analyticsModule) => {
        if (config.debug) {
          console.log('[useAnalyticsInit] Analytics module loaded');
        }
        return analyticsModule.initializeAnalytics(config, router);
      })
      .then(() => {
        if (config.debug) {
          console.log('[useAnalyticsInit] Analytics initialized successfully');
        }
      })
      .catch((error: unknown) => {
        console.error('[useAnalyticsInit] Failed to initialize analytics:', error);
      });
  }, [router]);
}
