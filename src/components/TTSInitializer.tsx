/**
 * Supernal TTS Initializer - Using Built-In Component
 *
 * This replaces the 100-line custom implementation with the package's
 * built-in TTSInitializer that handles everything automatically:
 * - Smart Loader (CDN + fallback)
 * - CSS injection
 * - Error handling
 * - Proper cleanup
 *
 * @see https://tts-docs.supernal.ai
 */

import { TTSInitializer } from '@supernal/tts-widget/react';

export default function TTSInit() {
  return (
    <TTSInitializer
      apiUrl={process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai'}
      apiKey={process.env.NEXT_PUBLIC_TTS_API_KEY || ''}
      mode="auto"
      version="major"
      timeout={5000}
      onCdnSuccess={() => console.log('[TTSInit] ✅ Loaded from CDN')}
      onCdnFail={(error) => console.warn('[TTSInit] ⚠️ CDN failed, using bundled:', error.message)}
    />
  );
}

