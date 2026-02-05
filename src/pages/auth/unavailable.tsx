/**
 * Auth Unavailable Page
 * 
 * Shown when authentication is misconfigured or broken.
 * 
 * SECURITY: This page contains NO sensitive content.
 * It's the fail-closed fallback when auth cannot be verified.
 */

import React from 'react';
import Head from 'next/head';

export default function AuthUnavailable() {
  return (
    <>
      <Head>
        <title>Authentication Unavailable | Supernal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mb-6">
            <svg 
              className="mx-auto h-16 w-16 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
              />
            </svg>
          </div>
          
          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Unavailable
          </h1>
          <p className="text-gray-600 mb-8">
            The authentication service is currently unavailable. 
            Please try again later or contact support if the problem persists.
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </a>
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          </div>
          
          {/* Help text */}
          <p className="mt-8 text-xs text-gray-400">
            If you're an administrator, check that all required environment variables are configured.
          </p>
        </div>
      </div>
    </>
  );
}
