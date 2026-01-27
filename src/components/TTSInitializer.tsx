'use client';

import { useEffect, useState } from 'react';

// Type declarations for Supernal TTS global
declare global {
  interface Window {
    SupernalTTS?: any;
    SupernalTTSInstance?: any;
  }
}

/**
 * Supernal TTS Initializer Component
 *
 * Loads TTS widget from CDN (like Google Analytics)
 * Should be rendered once in the root layout.
 *
 * Features:
 * - Client-side speed adjustment (cost-effective)
 * - Multi-voice support
 * - Auto-caching via Supernal TTS API
 *
 * @see https://tts-docs.supernal.ai
 */
export default function TTSInit() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[TTSInit] Component mounted, starting initialization...');

    // Only run on client side
    if (typeof window === 'undefined') {
      console.log('[TTSInit] Window undefined, skipping');
      return;
    }

    console.log('[TTSInit] Window available, proceeding with setup');

    // Load CSS
    const cssId = 'supernal-tts-css';
    if (!document.getElementById(cssId)) {
      console.log('[TTSInit] Adding CSS link...');
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/@supernal/tts-widget@1/dist/widget.css';
      document.head.appendChild(link);
      console.log('[TTSInit] CSS link added');
    } else {
      console.log('[TTSInit] CSS already loaded');
    }

    // Check if already loaded
    if (window.SupernalTTS && window.SupernalTTSInstance) {
      console.log('[TTSInit] Widget already loaded, skipping initialization');
      setIsLoading(false);
      return;
    }

    // Load widget from CDN via script tag
    console.log('[TTSInit] Loading widget from CDN...');
    const scriptId = 'supernal-tts-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/@supernal/tts-widget@1/dist/widget.js';
      script.type = 'module';

      script.onload = () => {
        console.log('[TTSInit] Widget script loaded from CDN');

        // Wait for SupernalTTS to be available
        const checkAndInit = () => {
          if (window.SupernalTTS) {
            console.log('[TTSInit] SupernalTTS available, initializing...');
            try {
              window.SupernalTTSInstance = new window.SupernalTTS({
                apiUrl: process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai',
                apiKey: process.env.NEXT_PUBLIC_TTS_API_KEY || '',
                provider: 'openai',
                voice: 'alloy',
                speed: 1.0,
                clientSideSpeed: true,
                showBranding: true,
                devMode: false
              });
              console.log('[TTSInit] Widget initialized successfully!');
              setIsLoading(false);
            } catch (err: any) {
              console.error('[TTSInit] Failed to initialize widget:', err);
              setError(err.message);
              setIsLoading(false);
            }
          } else {
            console.log('[TTSInit] SupernalTTS not yet available, retrying...');
            setTimeout(checkAndInit, 100);
          }
        };

        checkAndInit();
      };

      script.onerror = (err) => {
        console.error('[TTSInit] Failed to load widget script from CDN:', err);
        setError('Failed to load TTS widget from CDN');
        setIsLoading(false);
      };

      document.head.appendChild(script);
      console.log('[TTSInit] Script tag added to head');
    } else {
      console.log('[TTSInit] Script already exists');
      setIsLoading(false);
    }
  }, []);

  return null;
}

