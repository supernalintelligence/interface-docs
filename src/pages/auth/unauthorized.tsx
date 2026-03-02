/**
 * Unauthorized Page
 * 
 * Shown when a user is authenticated but not authorized to access.
 * This happens when ALLOWED_EMAILS is configured and the user's email is not in the list.
 */

import React from 'react';
import Head from 'next/head';
import type { GetServerSideProps } from 'next';

// Force server-side rendering to avoid static generation issues
export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default function Unauthorized() {
  return (
    <>
      <Head>
        <title>Access Denied | Supernal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
              />
            </svg>
          </div>
          
          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            Your account is not authorized to access this application.
            If you believe this is an error, please contact an administrator.
          </p>
          
          {/* Actions */}
          <div className="space-y-3">
            <a
              href="/api/auth/signout"
              className="block w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 transition-colors"
            >
              Sign out and try a different account
            </a>
            <a
              href="/"
              className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </a>
          </div>
          
          {/* Help */}
          <p className="mt-8 text-xs text-gray-400">
            Need access? Ask an administrator to add your email to the authorized users list.
          </p>
        </div>
      </div>
    </>
  );
}
