/**
 * Authentication Configuration - FAIL CLOSED
 * 
 * Security Model:
 * - Uses GitHub OAuth for authentication
 * - ALWAYS fails closed - if auth is misconfigured, access is DENIED
 * - Missing env vars = no access, not open access
 * - Auth errors = no access, not open access
 * 
 * Environment Variables Required:
 * - AUTH_SECRET: Random string for encrypting cookies (generate with: openssl rand -base64 32)
 * - GITHUB_CLIENT_ID: OAuth App Client ID
 * - GITHUB_CLIENT_SECRET: OAuth App Client Secret
 * 
 * Optional:
 * - ALLOWED_EMAILS: Comma-separated list of allowed email addresses
 */

import type { Session, User } from 'next-auth';
import { getServerSession } from 'next-auth';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

// ============================================================================
// AUTH CONFIGURATION VALIDATION
// ============================================================================

export interface AuthConfigStatus {
  isConfigured: boolean;
  hasClientId: boolean;
  hasClientSecret: boolean;
  hasAuthSecret: boolean;
  missingVars: string[];
}

/**
 * Check if auth is properly configured.
 * This is used by middleware and build scripts.
 */
export function getAuthConfigStatus(): AuthConfigStatus {
  const hasClientId = Boolean(process.env.GITHUB_CLIENT_ID);
  const hasClientSecret = Boolean(process.env.GITHUB_CLIENT_SECRET);
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET);
  
  const missingVars: string[] = [];
  if (!hasClientId) missingVars.push('GITHUB_CLIENT_ID');
  if (!hasClientSecret) missingVars.push('GITHUB_CLIENT_SECRET');
  if (!hasAuthSecret) missingVars.push('AUTH_SECRET');
  
  return {
    isConfigured: hasClientId && hasClientSecret && hasAuthSecret,
    hasClientId,
    hasClientSecret,
    hasAuthSecret,
    missingVars,
  };
}

/**
 * Throws if auth is not configured in production.
 * Used for fail-fast validation.
 */
export function assertAuthConfigured(): void {
  const status = getAuthConfigStatus();
  if (!status.isConfigured && process.env.NODE_ENV === 'production') {
    throw new Error(
      `[AUTH SECURITY] Missing required environment variables: ${status.missingVars.join(', ')}. ` +
      `Authentication CANNOT be disabled in production. This is a security violation.`
    );
  }
}

// ============================================================================
// ALLOWED USERS CONFIGURATION
// ============================================================================

/**
 * Get list of allowed email addresses.
 * Empty list means all authenticated users are allowed.
 */
export function getAllowedEmails(): string[] {
  const emails = process.env.ALLOWED_EMAILS;
  if (!emails) return [];
  return emails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
}

/**
 * Check if user is in the allowed list.
 * If no allowlist is configured, all authenticated users pass.
 */
export function isUserAllowed(email: string | null | undefined): boolean {
  const allowedEmails = getAllowedEmails();
  
  // No allowlist = all authenticated users allowed
  if (allowedEmails.length === 0) return true;
  
  // No email = not allowed
  if (!email) return false;
  
  return allowedEmails.includes(email.toLowerCase());
}

// ============================================================================
// SESSION HELPERS
// ============================================================================

/**
 * Get the NextAuth options for API routes.
 * This is used by [...nextauth].ts
 */
export function getAuthOptions() {
  const GitHub = require('next-auth/providers/github').default;
  
  return {
    providers: [
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      }),
    ],
    
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
    
    callbacks: {
      async signIn({ user }: { user: User }) {
        if (!user.email) {
          console.error('[AUTH] Sign-in denied: No email from provider');
          return false;
        }
        
        if (!isUserAllowed(user.email)) {
          console.warn(`[AUTH] Sign-in denied: ${user.email} not in allowlist`);
          return '/auth/unauthorized';
        }
        
        console.log(`[AUTH] Sign-in allowed: ${user.email}`);
        return true;
      },
      
      async session({ session, token }: { session: Session; token: { sub?: string } }) {
        if (session.user && token.sub) {
          (session.user as any).id = token.sub;
        }
        return session;
      },
      
      async jwt({ token, user }: { token: any; user?: User }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
    },
    
    session: {
      strategy: 'jwt' as const,
    },
    
    secret: process.env.AUTH_SECRET,
    
    debug: process.env.NODE_ENV === 'development',
  };
}

/**
 * Safe auth wrapper that returns null if auth is not configured.
 * Use this in pages/API routes instead of raw getServerSession().
 * 
 * SECURITY: If auth is not configured in production, this throws.
 * If getServerSession() fails, this returns null (which should trigger fail-closed behavior).
 */
export async function getSession(
  req?: GetServerSidePropsContext['req'] | NextApiRequest,
  res?: GetServerSidePropsContext['res'] | NextApiResponse
): Promise<Session | null> {
  const status = getAuthConfigStatus();
  
  // In production with no auth config = security violation
  if (process.env.NODE_ENV === 'production' && !status.isConfigured) {
    console.error('[AUTH SECURITY] Attempted to get session without auth configured');
    throw new Error('Auth not configured in production');
  }
  
  // In development with no auth config = return null (forces testing auth flows)
  if (!status.isConfigured) {
    console.warn('[AUTH] Auth not configured - returning null session');
    return null;
  }
  
  // Wrap getServerSession() in try/catch - NEVER allow exceptions to grant access
  try {
    if (req && res) {
      return await getServerSession(req, res, getAuthOptions());
    }
    // For middleware/edge, session check is done via cookie presence
    return null;
  } catch (error) {
    console.error('[AUTH SECURITY] getServerSession() threw an error:', error);
    // FAIL CLOSED: errors = no session = no access
    return null;
  }
}

/**
 * Require authentication for a page or API route.
 * Returns the session if authenticated, throws/redirects if not.
 * 
 * SECURITY: This is the primary way to protect routes.
 */
export async function requireAuth(
  req?: GetServerSidePropsContext['req'] | NextApiRequest,
  res?: GetServerSidePropsContext['res'] | NextApiResponse
): Promise<Session> {
  const session = await getSession(req, res);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}
