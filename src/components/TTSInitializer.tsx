'use client';

import { useEffect } from 'react';

// Type declarations for Supernal TTS global
declare global {
  interface Window {
    SupernalTTS?: any;
    SupernalTTSInstance?: any;
    SupernalTTSStatus?: { initialized: boolean };
  }
}

/**
 * Supernal TTS Initializer Component
 *
 * Initializes the TTS widget globally using the WidgetLoader directly.
 * Should be rendered once in the root layout.
 *
 * Uses the manual WidgetLoader approach (proven reliable) instead of
 * the <TTSInitializer> React component which doesn't reliably inject
 * play buttons after bundled fallback.
 *
 * @see https://tts-docs.supernal.ai
 */
export default function TTSInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Already loaded
    if (window.SupernalTTS && window.SupernalTTSInstance) {
      dispatchReady();
      return;
    }

    import('@supernal/tts-widget/loader').then(async (loaderModule) => {
      const { WidgetLoader } = loaderModule;

      try {
        const widget = await WidgetLoader.load({
          mode: 'auto',
          version: 'major',
          timeout: 5000,

          onCdnSuccess: () => {
            console.log('[TTSInit] Loaded from CDN');
          },
          onCdnFail: (error: Error) => {
            console.warn('[TTSInit] CDN failed, using bundled:', error.message);
          }
        });

        // Explicitly call init — this creates the instance AND scans the DOM
        widget.init({
          apiUrl: process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai',
          apiKey: process.env.NEXT_PUBLIC_TTS_API_KEY || '',
          provider: 'openai',
          voice: 'alloy',
          speed: 1.0,
          clientSideSpeed: true,
          showBranding: true,
          devMode: false
        });

        console.log('[TTSInit] Widget initialized');
        dispatchReady();
      } catch (err) {
        console.error('[TTSInit] Failed to initialize widget:', err);
      }
    }).catch((error) => {
      console.error('[TTSInit] Failed to load TTS widget module:', error);
    });
  }, []);

  return null;
}

/** Signal to ttsDetection that the widget is ready */
function dispatchReady() {
  if (typeof window === 'undefined') return;
  window.SupernalTTSStatus = { initialized: true };
  window.dispatchEvent(new Event('supernal-tts-ready'));
}
