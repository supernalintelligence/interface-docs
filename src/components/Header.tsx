/**
 * Standard header for the @supernal-interface demo site
 * Provides navigation between different pages with persistent chat
 */

import React from 'react';
import Link from 'next/link';
import { trackDocumentationUsage } from '../lib/analytics';
import { generateClientSideLLMGuide } from '../lib/generateLLMGuide';
import { Components } from '../architecture';

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onSettingsClick?: () => void; // Open settings modal
  onEarlyAccessClick?: () => void; // Open early access modal
  authButton?: React.ReactNode; // Optional auth button
}

export const Header: React.FC<HeaderProps> = ({ currentPage = 'home', onSettingsClick, onEarlyAccessClick, authButton }) => {
  const [copiedAI, setCopiedAI] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'demo', label: 'Demo', path: '/demo', testid: Components.GlobalNav.demo, submenu: [
      { id: 'demo-simple', label: 'Simple (Stateless)', path: '/demo/simple' },
      { id: 'demo-advanced', label: 'Advanced (Stateful)', path: '/demo/advanced' }
    ]},
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', testid: Components.GlobalNav.dashboard },
    { id: 'architecture', label: 'Architecture', path: '/architecture', testid: Components.GlobalNav.architecture },
    { id: 'docs', label: 'Documentation', path: '/docs', testid: Components.GlobalNav.docs },
    { id: 'examples', label: 'Examples', path: '/examples', testid: Components.GlobalNav.examples },
    { id: 'stories', label: 'Stories', path: '/stories', testid: Components.GlobalNav.stories },
    { id: 'blog', label: 'Blog', path: '/blog', testid: Components.GlobalNav.blog }
  ];

  const openGitHub = () => {
    window.open('https://github.com/supernalintelligence/interface', '_blank');
  };

  const copyForAIAgent = () => {
    // Generate fresh, up-to-date guide from source
    const completeGuide = generateClientSideLLMGuide();
    
    navigator.clipboard.writeText(completeGuide);
    trackDocumentationUsage('ai-agent-guide', 'copy');
    setCopiedAI(true);
    setTimeout(() => setCopiedAI(false), 2000);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo and Title - Clickable */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="Supernal Interface Logo" 
                className="w-8 h-8 rounded-lg"
                onError={(e) => {
                  // Fallback to gradient logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center hidden">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Supernal Interface</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                data-testid={item.testid}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Early Access CTA with Notched Edges */}
            {onEarlyAccessClick && (
              <button
                onClick={onEarlyAccessClick}
                className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium text-xs hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-1.5 notch-sm"
                title="Program with Supernal"
              >
                <span>Program with Supernal</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
            
            {/* Copy for AI Agent */}
            <button
              onClick={copyForAIAgent}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs transition-colors notch-sm ${
                copiedAI 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700'
              }`}
              title="Copy for AI Agent - Complete guide with examples"
            >
              {copiedAI ? (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs">Copied!</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-emerald-200 rounded-full animate-pulse"></div>
                  <span className="text-xs"> 📋 for AI</span>
                </>
              )}
            </button>
            
            {/* Auth Button (if provided) */}
            {authButton}
            
            {/* Settings Button */}
            {onSettingsClick && (
              <button
                data-tool-id="open-settings-modal"
                onClick={onSettingsClick}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Settings"
                aria-label="Open settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
            
            {/* GitHub Link */}
            <button
              onClick={openGitHub}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="View on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.path}
                  data-testid={item.testid}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              {onSettingsClick && (
                <button
                  onClick={() => {
                    onSettingsClick();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              )}
              <button
                onClick={openGitHub}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
