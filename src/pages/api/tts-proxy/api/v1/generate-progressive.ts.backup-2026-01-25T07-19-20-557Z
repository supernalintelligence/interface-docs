import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: true,
  },
};

/**
 * TTS API Proxy Route
 * 
 * NOTE: Currently not used - TTSInitializer calls tts.supernal.ai directly.
 * This proxy exists for debugging or alternative CORS workarounds.
 * 
 * To use: Update TTSInitializer.tsx apiUrl to '/api/tts-proxy'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('TTS Proxy - generate-progressive request:', {
    body: req.body,
  });

  try {
    const apiUrl = process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai';
    const apiKey = process.env.NEXT_PUBLIC_TTS_API_KEY || '';
    const endpoint = `${apiUrl}/api/v1/generate-progressive`;
    
    console.log('TTS Proxy - Forwarding to:', endpoint);
    console.log('TTS Proxy - Using API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');

    // Don't send preflight - just POST directly
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey, // lowercase header name (some APIs are case-sensitive)
      },
      body: JSON.stringify(req.body)
    });

    console.log('TTS Proxy - Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS Proxy - Error response:', errorText);
      return res.status(response.status).json({ 
        error: 'API request failed',
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('TTS Proxy - Success');

    res.status(200).json(data);
  } catch (error) {
    console.error('TTS Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
