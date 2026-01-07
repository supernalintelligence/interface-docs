import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('TTS Proxy - Received request:', {
    method: req.method,
    path: req.url,
    body: req.body,
  });

  try {
    // Widget appends /api/v1/generate-progressive to the apiUrl
    // So we need to extract that and forward to the real API
    const apiUrl = process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai';
    const apiKey = process.env.NEXT_PUBLIC_TTS_API_KEY || '';
    
    // The widget will call /api/tts-proxy/api/v1/generate-progressive
    // We need to forward to https://tts.supernal.ai/api/v1/generate-progressive
    const endpoint = `${apiUrl}/api/v1/generate-progressive`;
    
    console.log('TTS Proxy - Forwarding to:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
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
    console.log('TTS Proxy - Success:', data);

    res.status(200).json(data);
  } catch (error) {
    console.error('TTS Proxy Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate audio',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

