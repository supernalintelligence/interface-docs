/**
 * Demo Index - Redirects to Simple Tab
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useContainer } from "@supernal/interface/browser";

export default function DemoIndex() {
  useContainer('Demo'); // Register the Demo parent container
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/demo/simple');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to demo...</p>
    </div>
  );
}

