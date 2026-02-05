/**
 * Auth Error Page
 * 
 * Shown when authentication fails for a specific reason.
 * Different from /auth/unavailable which is for system-level auth failures.
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  
  // Map error codes to user-friendly messages
  const getErrorInfo = (errorCode?: string | string[]): { title: string; message: string } => {
    const code = Array.isArray(errorCode) ? errorCode[0] : errorCode;
    
    const errorInfo: Record<string, { title: string; message: string }> = {
      'Configuration': {
        title: 'Server Configuration Error',
        message: 'There is a problem with the authentication configuration. Please contact support.',
      },
      'AccessDenied': {
        title: 'Access Denied',
        message: 'You do not have permission to access this resource.',
      },
      'Verification': {
        title: 'Link Expired',
        message: 'The sign in link is no longer valid. It may have expired or already been used.',
      },
      'OAuthSignin': {
        title: 'Sign In Error',
        message: 'An error occurred while starting the sign in process. Please try again.',
      },
      'OAuthCallback': {
        title: 'Authentication Error',
        message: 'An error occurred while completing the sign in process. Please try again.',
      },
      'OAuthCreateAccount': {
        title: 'Account Error',
        message: 'Could not create your user account. Please try again or contact support.',
      },
      'Callback': {
        title: 'Callback Error',
        message: 'An error occurred during the authentication callback. Please try again.',
      },
      'OAuthAccountNotLinked': {
        title: 'Account Already Exists',
        message: 'An account with this email already exists using a different sign-in method.',
      },
      'Default': {
        title: 'Authentication Error',
        message: 'An unexpected error occurred during authentication. Please try again.',
      },
    };
    
    return errorInfo[code || 'Default'] || errorInfo['Default'];
  };
  
  const errorInfo = getErrorInfo(error);
  
  return (
    <>
      <Head>
        <title>Authentication Error | Supernal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <svg 
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" 
              />
            </svg>
          </div>
          
          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {errorInfo.message}
          </p>
          
          {/* Error Code (for debugging) */}
          {error && (
            <p className="text-xs text-gray-400 mb-6">
              Error code: {error}
            </p>
          )}
          
          {/* Actions */}
          <div className="space-y-3">
            <a
              href="/auth/signin"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </a>
            <a
              href="/"
              className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
