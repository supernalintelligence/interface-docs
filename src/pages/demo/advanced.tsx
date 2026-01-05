/**
 * Redirect: /demo/advanced → /demo/stateful
 * 
 * This page exists to redirect old "advanced" URLs to the new "stateful" route.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AdvancedRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new stateful route
    router.replace('/demo/stateful');
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div>
        <h2>Redirecting...</h2>
        <p>The Advanced demo has been renamed to Stateful demo.</p>
        <p>Redirecting to <Link href="/demo/stateful">/demo/stateful</Link>...</p>
      </div>
    </div>
  );
}
