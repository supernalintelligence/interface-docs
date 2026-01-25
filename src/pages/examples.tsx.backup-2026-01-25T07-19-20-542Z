/**
 * Examples Page Route - /examples
 * Redirects to /demo/live (unified demo page)
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ExamplesRoute() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/demo/live');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <p className="text-gray-400">Redirecting to live demo...</p>
    </div>
  );
}
