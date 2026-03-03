/**
 * useLocationTracking - Next.js integration for LocationContext
 *
 * Automatically tracks route changes and updates LocationContext so
 * ToolRegistry can correctly filter scoped tools.
 *
 * CRITICAL: This must be called in _app.tsx to enable tool scoping!
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LocationContext } from '@supernal/interface/browser';

export function useLocationTracking() {
  const router = useRouter();

  useEffect(() => {
    const updateLocation = () => {
      LocationContext.setCurrent({
        page: router.pathname,
        route: router.route,
        metadata: {
          query: router.query,
          asPath: router.asPath,
        },
      });

      console.log(`[LocationTracking] Updated location: ${router.pathname}`);
    };

    // Set initial location
    updateLocation();

    // Subscribe to route changes
    router.events.on('routeChangeComplete', updateLocation);

    return () => {
      router.events.off('routeChangeComplete', updateLocation);
    };
  }, [router.pathname, router.route, router.asPath]);
}
