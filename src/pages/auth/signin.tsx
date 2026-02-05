/**
 * Sign In Page
 * 
 * Custom sign-in page for GitHub OAuth.
 * Shows provider buttons and handles the OAuth flow initiation.
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import { getSession } from '../../lib/auth';

interface SignInProps {
  callbackUrl: string;
  error?: string;
}

export default function SignIn({ callbackUrl, error }: SignInProps) {
  const router = useRouter();
  
  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode?: string): string | null => {
    if (!errorCode) return null;
    
    const errorMessages: Record<string, string> = {
      'Configuration': 'There is a problem with the server configuration.',
      'AccessDenied': 'You do not have permission to sign in.',
      'Verification': 'The sign in link is no longer valid.',
      'OAuthSignin': 'Error starting the sign in process.',
      'OAuthCallback': 'Error completing the sign in process.',
      'OAuthCreateAccount': 'Could not create user account.',
      'EmailCreateAccount': 'Could not create user account.',
      'Callback': 'Error during the callback process.',
      'OAuthAccountNotLinked': 'Email already exists with different provider.',
      'Default': 'An error occurred during sign in.',
    };
    
    return errorMessages[errorCode] || errorMessages['Default'];
  };
  
  const errorMessage = getErrorMessage(error);
  
  return (
    <>
      <Head>
        <title>Sign In | Supernal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Supernal</h1>
            <p className="mt-2 text-gray-600">Sign in to access the dashboard</p>
          </div>
          
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <svg 
                  className="h-5 w-5 text-red-400 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}
          
          {/* Sign In Card */}
          <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">
              Continue with
            </h2>
            
            {/* GitHub Button */}
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl })}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </button>
            
            {/* Divider */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
          
          {/* Back link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Check if user is already signed in
  try {
    const session = await getSession(context.req, context.res);
    
    if (session) {
      // Already signed in, redirect to callback or dashboard
      const callbackUrl = (context.query.callbackUrl as string) || '/dashboard';
      return {
        redirect: {
          destination: callbackUrl,
          permanent: false,
        },
      };
    }
  } catch (error) {
    // Auth not configured or error - show sign in page
    // The auth system will handle the actual redirect to /auth/unavailable if needed
    console.error('[AUTH] Error checking session:', error);
  }
  
  return {
    props: {
      callbackUrl: (context.query.callbackUrl as string) || '/dashboard',
      error: (context.query.error as string) || null,
    },
  };
};
