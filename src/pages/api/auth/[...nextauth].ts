/**
 * NextAuth API Route
 * 
 * Handles all authentication requests:
 * - GET /api/auth/signin - Sign in page
 * - GET /api/auth/signout - Sign out page  
 * - POST /api/auth/signin/:provider - Start OAuth flow
 * - GET /api/auth/callback/:provider - OAuth callback
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/csrf - Get CSRF token
 * - GET /api/auth/providers - List providers
 * 
 * SECURITY: This route validates auth configuration and fails closed.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { getAuthConfigStatus, getAuthOptions } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // ============================================================
  // FAIL CLOSED: Check auth configuration FIRST
  // ============================================================
  
  const status = getAuthConfigStatus();
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!status.isConfigured) {
    if (isProduction) {
      console.error('[AUTH SECURITY] Auth API called without configuration in production');
      console.error('[AUTH SECURITY] Missing vars:', status.missingVars.join(', '));
      
      // Return 503 Service Unavailable
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
  
  // ============================================================
  // Auth is configured - handle the request
  // ============================================================
  
  try {
    return await NextAuth(req, res, getAuthOptions());
  } catch (error) {
    // ============================================================
    // FAIL CLOSED: Errors = no access
    // ============================================================
    
    console.error('[AUTH SECURITY] NextAuth threw an error:', error);
    
    return res.status(500).json({
      error: 'authentication_error',
      message: 'An error occurred during authentication',
    });
  }
}
