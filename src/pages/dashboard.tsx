/**
 * Dashboard Page Route - /dashboard
 * 
 * PROTECTED ROUTE: Requires authentication.
 * 
 * Security model:
 * - Server-side auth check in getServerSideProps
 * - Redirects to /auth/signin if not authenticated
 * - Redirects to /auth/unavailable if auth is misconfigured
 * - NEVER serves content without valid auth
 */

import React, { useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Header } from '../components/Header';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { DashboardPage } from '../components/pages/DashboardPage';
import { getSession, getAuthConfigStatus } from '../lib/auth';

interface DashboardRouteProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export default function DashboardRoute({ user }: DashboardRouteProps) {
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  return (
    <>
      <Head>
        <title>Dashboard - Supernal Interface</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header 
          onEarlyAccessClick={() => setShowEarlyAccessModal(true)}
        />
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* User context banner */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              👤 Signed in as <strong>{user.email}</strong>
              {' · '}
              <a 
                href="/api/auth/signout" 
                className="text-blue-600 hover:underline"
              >
                Sign out
              </a>
            </p>
          </div>
          
          <DashboardPage />
        </div>

        <EarlyAccessModal
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>
    </>
  );
}

/**
 * Server-side authentication check.
 * 
 * SECURITY: This runs on every request.
 * - Auth misconfigured → redirect to /auth/unavailable
 * - Auth error → redirect to /auth/unavailable
 * - Not authenticated → redirect to /auth/signin
 * - Authenticated → render page with user data
 */
export const getServerSideProps: GetServerSideProps<DashboardRouteProps> = async (context) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // --------------------------------------------------------
  // STEP 1: Check if auth is configured
  // --------------------------------------------------------
  const authStatus = getAuthConfigStatus();
  
  if (!authStatus.isConfigured) {
    if (isProduction) {
      console.error('[SECURITY] Dashboard accessed without auth config in production');
    } else {
      console.warn('[AUTH DEV] Auth not configured - redirecting to /auth/unavailable');
    }
    
    return {
      redirect: {
        destination: '/auth/unavailable',
        permanent: false,
      },
    };
  }
  
  // --------------------------------------------------------
  // STEP 2: Get session (wrapped in try/catch for safety)
  // --------------------------------------------------------
  try {
    const session = await getSession(context.req, context.res);
    
    // No session = not authenticated
    if (!session || !session.user) {
      console.log('[AUTH] No session for /dashboard - redirecting to sign in');
      return {
        redirect: {
          destination: '/auth/signin?callbackUrl=/dashboard',
          permanent: false,
        },
      };
    }
    
    // --------------------------------------------------------
    // STEP 3: Authenticated - render page
    // --------------------------------------------------------
    console.log(`[AUTH] Authenticated access to /dashboard: ${session.user.email}`);
    
    return {
      props: {
        user: {
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          image: session.user.image ?? null,
        },
      },
    };
    
  } catch (error) {
    // --------------------------------------------------------
    // FAIL CLOSED: Any error = no access
    // --------------------------------------------------------
    console.error('[SECURITY] Error checking auth for /dashboard:', error);
    
    return {
      redirect: {
        destination: '/auth/unavailable',
        permanent: false,
      },
    };
  }
};
