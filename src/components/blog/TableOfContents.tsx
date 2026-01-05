/**
 * Table of Contents Component
 * Automatically generates TOC from heading elements in the page
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronRight } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  contentSelector = '.prose' 
}) => {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Generate TOC from headings
    const generateToc = () => {
      const content = document.querySelector(contentSelector);
      if (!content) return;

      const headings = content.querySelectorAll('h2, h3, h4');
      const tocItems: TocItem[] = [];

      headings.forEach((heading) => {
        const id = heading.id || heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
        
        // Add ID if it doesn't exist
        if (!heading.id && id) {
          heading.id = id;
        }

        tocItems.push({
          id: id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1))
        });
      });

      setToc(tocItems);
    };

    // Generate TOC after a short delay to ensure content is rendered
    const timer = setTimeout(generateToc, 100);

    return () => clearTimeout(timer);
  }, [contentSelector]);

  useEffect(() => {
    // Track active heading on scroll
    const handleScroll = () => {
      const headings = toc.map(item => document.getElementById(item.id)).filter(Boolean);
      
      // Find the heading that's currently in view
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveId(heading.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="sticky top-24 h-fit">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <List className="h-4 w-4 text-blue-600" />
            <span>Table of Contents</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </motion.div>
        </button>

        {/* TOC Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200"
            >
              <ul className="py-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {toc.map((item) => {
                  const isActive = activeId === item.id;
                  const paddingLeft = `${(item.level - 2) * 1 + 1}rem`;

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToHeading(item.id)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all flex items-start gap-2 group ${
                          isActive
                            ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600 font-medium'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-2 border-transparent'
                        }`}
                        style={{ paddingLeft }}
                      >
                        <span className="flex-shrink-0 w-1 h-1 rounded-full bg-current mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="line-clamp-2">{item.text}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      >
        <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
          <span>Reading Progress</span>
          <span>
            {Math.min(
              100,
              Math.round(
                (window.pageYOffset /
                  (document.documentElement.scrollHeight - window.innerHeight)) *
                  100
              )
            )}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
            style={{
              width: `${Math.min(
                100,
                (window.pageYOffset /
                  (document.documentElement.scrollHeight - window.innerHeight)) *
                  100
              )}%`
            }}
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(
                100,
                (window.pageYOffset /
                  (document.documentElement.scrollHeight - window.innerHeight)) *
                  100
              )}%`
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Hook to trigger scroll progress updates
 */
export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.pageYOffset;
      const progress = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.round(progress)));
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return progress;
};

