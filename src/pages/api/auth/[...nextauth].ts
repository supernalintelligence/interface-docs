/**
 * NextAuth API Route (Stubbed)
 * 
 * Auth is not configured for development.
 * This stub prevents build errors while auth is being set up.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthConfigStatus } from '../../../lib/auth';

// Stub auth function for session checks
export async function auth() {
  return null;
}

// Stub sign-in/out functions  
export async function signIn() {
  return null;
}

export async function signOut() {
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const status = getAuthConfigStatus();
  
  if (!status.isConfigured) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.error('[AUTH SECURITY] Auth API called without configuration in production');
      return res.status(503).json({
        error: 'authentication_unavailable',
        message: 'Authentication service is not configured',
      });
    } else {
      console.warn('[AUTH DEV] Auth not configured. Missing:', status.missingVars.join(', '));
      return res.status(503).json({
        error: 'authentication_not_configured',
        message: 'Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and AUTH_SECRET to enable authentication',
        missing: status.missingVars,
      });
    }
  }
  
  // If auth is configured, return a message saying to use the real implementation
  return res.status(501).json({
    error: 'not_implemented',
    message: 'Auth is configured but the full handler needs to be implemented for v5',
  });
}
