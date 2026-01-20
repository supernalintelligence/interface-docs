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
 * Initializes the TTS widget globally for the site using vanilla JS widget.
 * Should be rendered once in the root layout.
 * 
 * Features:
 * - Client-side speed adjustment (cost-effective)
 * - Multi-voice support
 * - Auto-caching via Supernal TTS API
 * - CSS automatically loaded
 * 
 * @see https://tts-docs.supernal.ai
 */
export default function TTSInit() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Load CSS
    const cssId = 'supernal-tts-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/supernal-tts-widget@latest/dist/widget.css';
      document.head.appendChild(link);
    }

    // Load and initialize widget
    import('supernal-tts-widget').then((module) => {
      const { SupernalTTS } = module;
      
      if (!window.SupernalTTS || !window.SupernalTTSInstance) {
        // Call API directly from browser (like your working blog does)
        SupernalTTS.init({
          apiUrl: process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai',
          apiKey: process.env.NEXT_PUBLIC_TTS_API_KEY || '',
          provider: 'openai',
          voice: 'alloy',
          speed: 1.0,
          clientSideSpeed: true,
          showBranding: true,
          devMode: window.location.hostname === 'localhost'  // Only on localhost

        });
      }
    }).catch((error) => {
      console.error('Failed to load Supernal TTS widget:', error);
    });
  }, []);

  return null;
}

