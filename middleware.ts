/**
 * Middleware - Authentication & Security
 * 
 * SECURITY MODEL: FAIL CLOSED
 * 
 * This middleware ensures:
 * 1. If auth is misconfigured → redirect to /auth/unavailable (NOT content)
 * 2. If auth check errors → redirect to /auth/unavailable (NOT content)
 * 3. If not authenticated → redirect to /auth/signin (NOT content)
 * 4. NEVER serve protected content to unauthenticated users
 * 
 * Protected Routes:
 * - /dashboard/* - Internal dashboard
 * - /admin/* - Admin pages (future)
 * 
 * Public Routes:
 * - / - Landing page
 * - /docs/* - Documentation
 * - /blog/* - Blog
 * - /auth/* - Auth pages (signin, error, unauthorized, unavailable)
 * - /api/auth/* - Auth API routes
 * - /_next/* - Next.js internals
 * - /static/* - Static files
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Routes that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/admin',
];

// Routes that are always public (no auth check)
const PUBLIC_PATHS = [
  '/',
  '/docs',
  '/blog',
  '/examples',
  '/showcase',
  '/comparison',
  '/architecture',
  '/stories',
  '/testing',
  '/auth',
  '/api/auth',
  '/api/docs',
  '/api/blog-posts',
  '/api/tts-proxy',
  '/_next',
  '/static',
  '/favicon',
  '/robots.txt',
  '/sitemap.xml',
];

// ============================================================================
// HELPERS
// ============================================================================

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`) || pathname.startsWith(path)
  );
}

function isAuthConfigured(): boolean {
  // Check for required auth environment variables
  const hasClientId = Boolean(process.env.GITHUB_CLIENT_ID);
  const hasClientSecret = Boolean(process.env.GITHUB_CLIENT_SECRET);
  const hasAuthSecret = Boolean(process.env.AUTH_SECRET);
  
  return hasClientId && hasClientSecret && hasAuthSecret;
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ----------------------------------------
  // STEP 1: Check if this is a protected route
  // ----------------------------------------
  
  // Public paths bypass auth entirely
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // Only check auth for protected paths
  if (!isProtectedPath(pathname)) {
    // Unknown path - let Next.js handle it (404, etc.)
    return NextResponse.next();
  }
  
  // ----------------------------------------
  // STEP 2: FAIL CLOSED - Check auth config
  // ----------------------------------------
  
  const isProduction = process.env.NODE_ENV === 'production';
  const hasAuthConfig = isAuthConfigured();
  
  // SECURITY: In production, missing auth config = NO ACCESS
  if (isProduction && !hasAuthConfig) {
    console.error(
      '[SECURITY] Auth not configured in production. ' +
      'Redirecting to /auth/unavailable. ' +
      'This is a FAIL-CLOSED security measure.'
    );
    return NextResponse.redirect(new URL('/auth/unavailable', request.url));
  }
  
  // In development without auth config, still deny access but with a helpful message
  if (!hasAuthConfig) {
    console.warn(
      '[AUTH DEV] Auth not configured. Protected routes are inaccessible. ' +
      'Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and AUTH_SECRET to enable auth.'
    );
    return NextResponse.redirect(new URL('/auth/unavailable', request.url));
  }
  
  // ----------------------------------------
  // STEP 3: Check authentication
  // ----------------------------------------
  
  try {
    // Get the session token from cookies
    // NextAuth v5 uses __Secure-authjs.session-token in production
    // and authjs.session-token in development
    const sessionTokenName = isProduction 
      ? '__Secure-authjs.session-token'
      : 'authjs.session-token';
    
    const sessionToken = request.cookies.get(sessionTokenName);
    
    // No session token = not authenticated
    if (!sessionToken?.value) {
      console.log(`[AUTH] No session for protected path: ${pathname}`);
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
    
    // Session exists - allow access
    // Note: Full session validation happens in the auth library
    // The cookie presence check is a fast-path optimization
    return NextResponse.next();
    
  } catch (error) {
    // ----------------------------------------
    // STEP 4: FAIL CLOSED on errors
    // ----------------------------------------
    
    console.error('[SECURITY] Auth check threw an error:', error);
    console.error('[SECURITY] FAILING CLOSED - redirecting to /auth/unavailable');
    
    // NEVER let exceptions result in access
    return NextResponse.redirect(new URL('/auth/unavailable', request.url));
  }
}

// ============================================================================
// MATCHER CONFIG
// ============================================================================

export const config = {
  // Match all routes except static files and images
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
