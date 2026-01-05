/**
 * Demo Layout - Shared tab navigation for all demo routes
 */

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header } from './Header';
import { Components } from '../architecture';

interface DemoLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  activeTab: 'simple' | 'advanced' | 'hierarchical' | 'stateful';
}

export const DemoLayout: React.FC<DemoLayoutProps> = ({ 
  children, 
  title, 
  description,
  activeTab 
}) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title} - Supernal Interface</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header 
          currentPage="demo"
          onNavigate={(page) => router.push(`/${page}`)}
          onSettingsClick={() => {}}
        />

        <main data-testid={Components.Demo.container} className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Interactive Demo</h1>
            <p className="text-gray-600 mt-2">
              Explore three distinct patterns for building AI-controllable UIs
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <Link 
                href="/demo/simple"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'simple'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>📋</span>
                  <span>Simple (Stateless)</span>
                </div>
              </Link>

              <Link 
                href="/demo/advanced"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'advanced'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>💾</span>
                  <span>Stateful</span>
                </div>
              </Link>

              <Link 
                href="/demo/hierarchical"
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'hierarchical'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>🏗️</span>
                  <span>Hierarchical (Nested)</span>
                </div>
              </Link>
            </nav>
          </div>

          {/* Tab Description */}
          {description && (
            <div className="mb-6">
              {description}
            </div>
          )}

          {/* Tab Content */}
          {children}
        </main>
      </div>
    </>
  );
};

