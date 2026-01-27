/**
 * Docs Page Route - /docs
 */

import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EarlyAccessModal } from '../components/EarlyAccessModal';
import { getSections } from '../lib/content';
import { Doc } from '../lib/content/types';

// Inline DocLayout component to avoid import issues
const DocLayout: React.FC<{ doc: Doc }> = ({ doc }) => {
  return (
    <article className="max-w-full md:max-w-4xl mx-auto px-1 md:px-0 overflow-x-hidden">
      {/* Header */}
      <header className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-200">
        <div className="mb-3 md:mb-4">
          {doc.metadata.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
              {doc.metadata.category}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          {doc.metadata.title}
        </h1>
        {doc.metadata.description && (
          <p className="text-lg md:text-xl text-gray-600">
            {doc.metadata.description}
          </p>
        )}
      </header>

      {/* Content */}
      <div
        className="prose prose-sm md:prose-lg max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-800"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />

      {/* Child docs */}
      {doc.childDocs && doc.childDocs.length > 0 && (
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Related Topics</h2>
          <div className="grid gap-3 md:gap-4">
            {doc.childDocs.map((child) => (
              <a
                key={child.slug}
                href={`/docs/${child.slug}`}
                className="block p-3 md:p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="text-base md:text-lg font-semibold text-gray-900">{child.metadata.title}</h3>
                {child.excerpt && (
                  <p className="text-sm text-gray-600 mt-1">{child.excerpt}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

interface DocListItem {
  slug: string;
  title: string;
  sectionId: string;
}

interface DocsProps {
  sections: Array<{
    id: string;
    name: string;
    description?: string;
    docs: DocListItem[];
  }>;
  firstDocSlug?: string;
}

export default function DocsRoute({ sections, firstDocSlug }: DocsProps) {
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(firstDocSlug || null);
  const [loading, setLoading] = useState(false);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleDocSelect = useCallback(async (slug: string) => {
    setSelectedSlug(slug);
    setLoading(true);
    try {
      // Fetch from API route instead of using Node.js fs
      const response = await fetch(`/api/docs/${encodeURIComponent(slug)}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const doc = await response.json();
      setSelectedDoc(doc);
    } catch (_error) {
      // Error loading doc
      setSelectedDoc(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load first doc on mount
  useEffect(() => {
    if (firstDocSlug && !selectedDoc) {
      handleDocSelect(firstDocSlug);
    }
  }, [firstDocSlug, selectedDoc, handleDocSelect]);

  if (!sections || sections.length === 0) {
    return (
      <>
        <Head>
          <title>Docs - Supernal Interface Demo</title>
        </Head>
        <div className="min-h-screen bg-gray-50">
          <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">📖 Documentation</h1>
            <p className="text-gray-600">No documentation found. Add markdown files to <code>content/docs/</code></p>
          </div>
          {/* Chat is now global in _app.tsx */}
          <EarlyAccessModal 
            isOpen={showEarlyAccessModal}
            onClose={() => setShowEarlyAccessModal(false)}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Docs - Supernal Interface Demo</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />

        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
              data-testid="mobile-docs-menu-toggle"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Documentation Menu</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 overflow-x-hidden">
          <div className="grid lg:grid-cols-12 gap-6 px-1 md:px-4 overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 bg-white rounded-lg shadow-sm p-6 sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 text-gray-900">📚 Documentation</h2>
              <nav className="space-y-6">
                {sections.map(section => {
                  // Define section order and better names
                  const sectionMeta: Record<string, { name: string; order: number; icon: string }> = {
                    '': { name: '🏠 Overview', order: 0, icon: '🏠' },
                    'getting-started': { name: '🎯 Getting Started', order: 1, icon: '🎯' },
                    'architecture': { name: '🏗️ Architecture', order: 2, icon: '🏗️' },
                    'testing': { name: '🧪 Testing', order: 3, icon: '🧪' },
                    'requirements': { name: '📋 Requirements', order: 4, icon: '📋' },
                    'planning': { name: '📈 Planning', order: 5, icon: '📈' },
                    'status': { name: '🚦 Status', order: 6, icon: '🚦' },
                    'research': { name: '🔬 Research', order: 7, icon: '🔬' },
                    'analysis': { name: '📊 Analysis', order: 8, icon: '📊' },
                    'blog': { name: '📝 Blog', order: 9, icon: '📝' },
                  };
                  
                  const meta = sectionMeta[section.id] || { 
                    name: section.name, 
                    order: 999,
                    icon: '📄'
                  };
                  
                  return { ...section, ...meta };
                }).sort((a, b) => a.order - b.order).map(section => (
                  <div key={section.id}>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      {section.name}
                    </h3>
                    <ul className="space-y-1">
                      {section.docs.map(doc => (
                        <li key={doc.slug}>
                          <button
                            onClick={() => handleDocSelect(doc.slug)}
                            className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedSlug === doc.slug
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            {doc.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>

            {/* Mobile Sidebar Drawer */}
            {isMobileSidebarOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="lg:hidden fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  data-testid="mobile-docs-sidebar-backdrop"
                />
                {/* Drawer */}
                <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto shadow-2xl">
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">📚 Documentation</h2>
                    <button
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                      data-testid="mobile-docs-sidebar-close"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <nav className="p-4 space-y-6">
                    {sections.map(section => {
                      const sectionMeta: Record<string, { name: string; order: number; icon: string }> = {
                        '': { name: '🏠 Overview', order: 0, icon: '🏠' },
                        'getting-started': { name: '🎯 Getting Started', order: 1, icon: '🎯' },
                        'architecture': { name: '🏗️ Architecture', order: 2, icon: '🏗️' },
                        'testing': { name: '🧪 Testing', order: 3, icon: '🧪' },
                        'requirements': { name: '📋 Requirements', order: 4, icon: '📋' },
                        'planning': { name: '📈 Planning', order: 5, icon: '📈' },
                        'status': { name: '🚦 Status', order: 6, icon: '🚦' },
                        'research': { name: '🔬 Research', order: 7, icon: '🔬' },
                        'analysis': { name: '📊 Analysis', order: 8, icon: '📊' },
                        'blog': { name: '📝 Blog', order: 9, icon: '📝' },
                      };

                      const meta = sectionMeta[section.id] || {
                        name: section.name,
                        order: 999,
                        icon: '📄'
                      };

                      return { ...section, ...meta };
                    }).sort((a, b) => a.order - b.order).map(section => (
                      <div key={section.id}>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          {section.name}
                        </h3>
                        <ul className="space-y-1">
                          {section.docs.map(doc => (
                            <li key={doc.slug}>
                              <button
                                onClick={() => {
                                  handleDocSelect(doc.slug);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                  selectedSlug === doc.slug
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                {doc.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                </aside>
              </>
            )}

            {/* Content */}
            <main className="lg:col-span-9 bg-white rounded-lg shadow-sm p-2 md:p-8 lg:py-6 overflow-x-hidden">
              {loading ? (
                <div className="text-center py-20 text-gray-400">
                  Loading...
                </div>
              ) : selectedDoc ? (
                <DocLayout doc={selectedDoc} />
              ) : (
                <div className="text-center py-10 md:py-20 px-0 md:px-0">
                  <div className="text-4xl md:text-6xl mb-4">📚</div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Welcome to Supernal Interface Docs
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Select a document from the menu to get started
                  </p>
                  <div className="max-w-2xl mx-auto text-left bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-3">
                      🎯 Recommended Reading Path
                    </h3>
                    <ol className="space-y-2 text-sm text-blue-800">
                      <li>1. <strong>Getting Started</strong> - Quick setup guide</li>
                      <li>2. <strong>Architecture</strong> - Core concepts</li>
                      <li>3. <strong>Testing</strong> - Build robust apps</li>
                      <li>4. <strong>Advanced Topics</strong> - Dive deeper</li>
                    </ol>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
        
        {/* Chat is now global in _app.tsx */}
        
        <EarlyAccessModal
          isOpen={showEarlyAccessModal}
          onClose={() => setShowEarlyAccessModal(false)}
        />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

// This runs at BUILD TIME on the server
export async function getStaticProps() {
  // Import only for server-side use
  const { getAllDocs } = await import('../lib/content');
  
  try {
    const sections = await getSections();
    const allDocs = await getAllDocs();
    
    // Only send minimal navigation data - NOT the full content/html
    const lightweightSections = sections.map(section => ({
      id: section.id,
      name: section.name,
      description: section.description || null,
      docs: section.docs.map(doc => ({
        slug: doc.slug,
        title: doc.metadata.title,
        sectionId: doc.sectionId || section.id,
      }))
    }));
    
    const firstDocSlug = allDocs[0]?.slug || null;
    
    return {
      props: {
        sections: lightweightSections,
        firstDocSlug,
      },
    };
  } catch (_error) {
    // Error loading docs
    return {
      props: {
        sections: [],
        firstDocSlug: null,
      },
    };
  }
}

