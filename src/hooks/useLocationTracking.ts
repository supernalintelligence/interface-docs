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

/**
 * Scan the DOM for visible elements with data-testid attributes
 * and return their IDs for LocationContext tracking
 */
function getVisibleElements(): string[] {
  if (typeof document === 'undefined') return [];

  const elements = document.querySelectorAll('[data-testid]');
  return Array.from(elements).map(el => el.getAttribute('data-testid')).filter(Boolean) as string[];
}

export function useLocationTracking() {
  const router = useRouter();

  useEffect(() => {
    const updateLocation = () => {
      // Scan DOM for visible elements
      const visibleElements = getVisibleElements();

      LocationContext.setCurrent({
        page: router.pathname,
        route: router.route,
        elements: visibleElements,
        metadata: {
          query: router.query,
          asPath: router.asPath,
        },
      });

      console.log(`[LocationTracking] Updated location: ${router.pathname}`);
      console.log(`[LocationTracking] Visible elements (${visibleElements.length}):`, visibleElements.slice(0, 10));
    };

    // Set initial location after a brief delay to ensure DOM is ready
    const initialTimer = setTimeout(updateLocation, 100);

    // Periodically re-scan for elements (handles dynamic content)
    const intervalId = setInterval(updateLocation, 1000);

    // Subscribe to route changes
    const handleRouteChange = () => {
      // Delay to ensure new page DOM is rendered
      setTimeout(updateLocation, 100);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.pathname, router.route, router.asPath]);
}
