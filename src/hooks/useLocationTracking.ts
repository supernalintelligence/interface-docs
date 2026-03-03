/**
 * useLocationTracking - Next.js integration for LocationContext
 *
 * Automatically tracks route changes and updates LocationContext so
 * ToolRegistry can correctly filter scoped tools.
 *
 * CRITICAL: This must be called in _app.tsx to enable tool scoping!
 */

import { useEffect, useRef } from 'react';
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

/**
 * Compare two arrays for equality
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
}

export function useLocationTracking() {
  const router = useRouter();
  const lastLocationRef = useRef<string>('');
  const lastElementsRef = useRef<string[]>([]);

  useEffect(() => {
    const updateLocation = () => {
      // Scan DOM for visible elements
      const visibleElements = getVisibleElements();

      // Check if anything has actually changed
      const locationChanged = lastLocationRef.current !== router.pathname;
      const elementsChanged = !arraysEqual(lastElementsRef.current, visibleElements);

      // Only update and log if something changed
      if (locationChanged || elementsChanged) {
        LocationContext.setCurrent({
          page: router.pathname,
          route: router.route,
          elements: visibleElements,
          metadata: {
            query: router.query,
            asPath: router.asPath,
          },
        });

        // Only log if there's an actual change
        if (locationChanged) {
          console.log(`[LocationTracking] Updated location: ${router.pathname}`);
        }
        if (elementsChanged) {
          console.log(`[LocationTracking] Visible elements changed: ${visibleElements.length} elements`);
        }

        // Update refs
        lastLocationRef.current = router.pathname;
        lastElementsRef.current = visibleElements;
      }
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
