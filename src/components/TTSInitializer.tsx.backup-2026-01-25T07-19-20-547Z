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
 * Initializes the TTS widget globally for the site using the v1.3.x Smart Loader.
 * Should be rendered once in the root layout.
 *
 * Features:
 * - Auto-updates from CDN with graceful fallback to bundled version
 * - Client-side speed adjustment (cost-effective)
 * - Multi-voice support
 * - Auto-caching via Supernal TTS API
 * - CSS automatically loaded
 *
 * Migration: Updated from v1.1.x to v1.3.x Smart Loader pattern
 * @see https://tts-docs.supernal.ai
 */
export default function TTSInit() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Load CSS
    const cssId = 'supernal-tts-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/@supernal/tts-widget@1/dist/widget.css';
      document.head.appendChild(link);
    }

    // Load and initialize widget using new Smart Loader
    import('@supernal/tts-widget/loader').then(async (loaderModule) => {
      const { WidgetLoader } = loaderModule;

      if (!window.SupernalTTS || !window.SupernalTTSInstance) {
        try {
          // Load widget with Smart Loader (auto mode with CDN + fallback)
          const widget = await WidgetLoader.load({
            mode: 'auto',        // Try CDN, fallback to bundled
            version: 'major',    // Load latest v1.x.x
            timeout: 5000,       // 5s timeout before fallback

            onCdnSuccess: () => {
              console.log('[TTS] Loaded from CDN (always up-to-date)');
            },

            onCdnFail: (error) => {
              console.warn('[TTS] CDN failed, using bundled version:', error.message);
            }
          });

          // Initialize widget
          widget.init({
            apiUrl: process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai',
            apiKey: process.env.NEXT_PUBLIC_TTS_API_KEY || '',
            provider: 'openai',
            voice: 'alloy',
            speed: 1.0,
            clientSideSpeed: true,
            showBranding: true,
            devMode: window.location.hostname === 'localhost'
          });

          setIsLoading(false);
        } catch (err: any) {
          console.error('[TTS] Failed to initialize widget:', err);
          setError(err.message);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('[TTS] Failed to load Supernal TTS widget module:', error);
      setError(error.message);
      setIsLoading(false);
    });
  }, []);

  // Optional: You can render loading/error states if needed
  // For now, keeping it invisible like the original
  return null;
}

