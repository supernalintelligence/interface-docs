/**
 * Standard header for the @supernal-interface demo site
 * Provides navigation between different pages with persistent chat
 */

import React from 'react';
import Link from 'next/link';
import { trackDocumentationUsage } from '../lib/analytics';
import { generateClientSideLLMGuide } from '../lib/generateLLMGuide';
import { Components } from '../architecture';
import { brandAssets, brandText } from '@/lib/brand';
import { Routes } from '../architecture/Routes';
import { theme } from '@/config/theme';

import { testId } from '@supernal/interface/testing';
import { Header as HeaderNames } from '@/architecture/ComponentNames';
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
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = React.useState<string | null>('features');

  const navItems = [
    {
      id: 'features',
      label: 'Features',
      path: '/demo',
      testid: Components.GlobalNav.demo,
      submenu: [
        {
          id: 'demo',
          label: 'Agentic Control',
          path: '/demo'
        },
        {
          id: 'testing',
          label: 'Contractual Testing',
          path: '/testing'
        },
        {
          id: 'onboarding',
          label: 'User Onboarding',
          path: '/stories'
        },
        {
          id: 'videos',
          label: 'Automated Demo Videos',
          path: '/videos'
        }
      ]
    },
    { id: 'showcase', label: 'Showcase', path: '/showcase', testid: Components.GlobalNav.showcase },
    { id: 'blog', label: 'Blog', path: '/blog', testid: Components.GlobalNav.blog }
  ];

  const rightNavItems = [
    { id: 'docs', label: 'Docs', path: '/docs', testid: Components.GlobalNav.docs }
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
    <header className="bg-slate-900 shadow-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo and Title - Clickable */}
          <Link href={Routes.root} className="flex items-center hover:opacity-80 transition-opacity" style={{gap: '0.75rem'}} data-testid={testId(HeaderNames.link)}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brandAssets.logo}
                alt={`${brandText.product} Logo`}
                className="w-10 h-10"
                onError={(e) => {
                  // Fallback to gradient logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center hidden">
                <span className="text-white font-bold text-sm">SI</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{brandText.product}</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center flex-1" style={{marginLeft: '3rem'}}>
            {/* Left side nav */}
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const itemWithMenu = item as any;
                return (
                <div key={item.id} className="relative">
                  {itemWithMenu.submenu ? (
                    // Dropdown Menu Item
                    <div
                      onMouseEnter={() => setOpenDropdown(item.id)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="relative"
                    >
                      <button
                        data-testid={item.testid}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                          currentPage === item.id
                            ? 'bg-purple-500 text-white'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openDropdown === item.id && (
                        <div className="absolute left-0 top-full pt-2 w-56 z-50">
                          <div className="bg-slate-800 rounded-md shadow-xl border border-white/10 py-2">
                            {itemWithMenu.submenu.map((subitem: any) => (
                              <Link
                                key={subitem.id}
                                href={subitem.path}
                                className="block px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/20 hover:text-white transition-colors"
                              >
                                <div className="font-medium">{subitem.label}</div>
                                {subitem.description && (
                                  <div className="text-xs text-gray-500 mt-0.5">{subitem.description}</div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular Link
                    <Link
                      href={item.path}
                      data-testid={item.testid}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === item.id
                          ? 'bg-purple-500 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
              })}
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Right side nav */}
            <div className="flex items-center space-x-1 mr-2">
              {rightNavItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                  data-testid={item.testid}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? 'bg-purple-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* GitHub Link */}
            <button
              onClick={openGitHub}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="View on GitHub"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Copy for AI */}
            <button
              onClick={copyForAIAgent}
              className="p-2 text-gray-400 hover:text-white transition-colors relative group"
              title="Copy for AI"
              aria-label="Copy documentation for AI"
            >
              {copiedAI ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Copy for AI
              </span>
            </button>

            {/* Early Access / Login */}
            {onEarlyAccessClick && (
              <button
                onClick={onEarlyAccessClick}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                aria-label="Get Early Access"
              >
                Get Access
              </button>
            )}

            {/* Auth Button (if provided) */}
            {authButton}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
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
          <>
            {/* Backdrop Overlay */}
            <div className="md:hidden fixed inset-0 top-[73px] bg-slate-950/95 backdrop-blur-md z-40" onClick={() => setMobileMenuOpen(false)} />

            {/* Menu Panel - Fixed Layout */}
            <div className="md:hidden fixed top-[73px] left-0 right-0 bottom-0 bg-slate-900/98 border-t border-white/10 z-50 flex flex-col">

              {/* Scrollable Navigation Section */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <nav className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const itemWithMenu = item as any;
                const hasSubmenu = !!itemWithMenu.submenu;
                const isSubmenuOpen = mobileSubmenuOpen === item.id;

                return (
                  <div key={item.id}>
                    {hasSubmenu ? (
                      // Item with submenu - expandable
                      <>
                        <button
                          data-testid={item.testid}
                          onClick={() => setMobileSubmenuOpen(isSubmenuOpen ? null : item.id)}
                          className="w-full px-4 py-3 rounded-lg text-base font-semibold transition-all flex items-center justify-between text-white hover:bg-white/10"
                        >
                          <span>{item.label}</span>
                          <svg
                            className={`w-5 h-5 transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isSubmenuOpen && (
                          <div className="mt-1 ml-2 space-y-1 border-l-2 border-purple-500/30 pl-4">
                            {itemWithMenu.submenu.map((subitem: any) => (
                              <Link
                                key={subitem.id}
                                href={subitem.path}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileSubmenuOpen(null);
                                }}
                                className="block px-4 py-3 rounded-lg text-base text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all"
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      // Regular item without submenu
                      <Link
                        href={item.path}
                        data-testid={item.testid}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                          currentPage === item.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}
                </nav>
              </div>

              {/* Fixed Bottom Actions - Above Microphone */}
              <div className="flex-shrink-0 border-t border-white/10 bg-slate-900/95 backdrop-blur-sm px-4 py-3 pb-32">
                <div className="flex items-center gap-3">
                  {/* Docs Icon */}
                  <Link
                    href={Routes.docs}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 bg-slate-800 text-gray-300 rounded-lg border border-white/10 transition-all hover:bg-slate-700 hover:text-white"
                    aria-label="Documentation"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </Link>

                  {/* GitHub Icon */}
                  <button
                    onClick={openGitHub}
                    className="p-2.5 bg-slate-800 text-gray-300 rounded-lg border border-white/10 transition-all hover:bg-slate-700 hover:text-white"
                    aria-label="GitHub"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* Sign In / Get Access */}
                  {onEarlyAccessClick && (
                    <button
                      onClick={() => {
                        onEarlyAccessClick();
                        setMobileMenuOpen(false);
                      }}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg transition-all hover:from-purple-700 hover:to-pink-700 shadow-lg"
                    >
                      <span className="text-sm font-semibold">Sign In</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
