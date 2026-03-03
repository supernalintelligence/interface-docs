import React from 'react';
import { Doc } from '../../lib/content/types';

interface DocLayoutProps {
  doc: Doc;
}

export const DocLayout: React.FC<DocLayoutProps> = ({ doc }) => {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 pb-6 border-b border-gray-200">
        <div className="mb-4">
          {doc.metadata.category && (
            <span className="inline-block px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
              {doc.metadata.category}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {doc.metadata.title}
        </h1>
        {doc.metadata.description && (
          <p className="text-xl text-gray-600">
            {doc.metadata.description}
          </p>
        )}
      </header>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-800"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />

      {/* Child docs */}
      {doc.childDocs && doc.childDocs.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Related Topics</h2>
          <div className="grid gap-4">
            {doc.childDocs.map((child) => (
              <a
                key={child.slug}
                href={`/docs/${child.slug}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900">{child.metadata.title}</h3>
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





