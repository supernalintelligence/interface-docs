'use client';

import { useEffect } from 'react';

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
 * Initializes the TTS widget globally for the site using the Smart Loader.
 * Should be rendered once in the root layout.
 *
 * Features:
 * - Auto-updates from CDN with graceful fallback to bundled version
 * - Client-side speed adjustment (cost-effective)
 * - Multi-voice support
 * - Auto-caching via Supernal TTS API
 * - CSS automatically loaded
 *
 * Smart Loader: Tries CDN first, falls back to installed package on failure
 * @see https://tts-docs.supernal.ai
 */
export default function TTSInit() {
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
      return;
    }

    // Load and initialize widget using Smart Loader (auto mode with fallback)
    console.log('[TTSInit] Loading widget with Smart Loader (CDN + fallback)...');
    import('@supernal/tts-widget/loader').then(async (loaderModule) => {
      const { WidgetLoader } = loaderModule;

      try {
        // Load widget with Smart Loader (auto mode with CDN + fallback)
        const widget = await WidgetLoader.load({
          mode: 'auto',        // Try CDN, fallback to bundled
          version: 'major',    // Load latest v1.x.x
          timeout: 5000,       // 5s timeout before fallback

          onCdnSuccess: () => {
            console.log('[TTSInit] ✅ Loaded from CDN (always up-to-date)');
          },

          onCdnFail: (error: Error) => {
            console.warn('[TTSInit] ⚠️ CDN failed, using bundled version:', error.message);
          }
        });

        console.log('[TTSInit] Widget loaded, initializing...');

        // Initialize widget
        widget.init({
          apiUrl: process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai',
          apiKey: process.env.NEXT_PUBLIC_TTS_API_KEY || '',
          provider: 'openai',
          voice: 'alloy',
          speed: 1.0,
          clientSideSpeed: true,
          showBranding: true,
          devMode: false && window.location.hostname === 'localhost'
        });

        console.log('[TTSInit] ✅ Widget initialized successfully!');
      } catch (err: any) {
        console.error('[TTSInit] ❌ Failed to initialize widget:', err);
      }
    }).catch((error) => {
      console.error('[TTSInit] ❌ Failed to load Supernal TTS widget module:', error);
    });
  }, []);

  return null;
}

