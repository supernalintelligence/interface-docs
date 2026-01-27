/**
 * Blog Index Page - Shows all blog posts as cards
 * Server-side rendered with Next.js Pages Router
 */

import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { EarlyAccessModal } from '../../components/EarlyAccessModal';
import { getBlogPosts } from '../../lib/content/blog';
import { Post } from '../../lib/content/types';
import BlogCard from '../../components/blog/BlogCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { Blog } from '../../architecture/DemoComponentNames';
import { DemoContainers } from '../../architecture';
import { useContainer } from "@supernal/interface/browser";

interface BlogIndexProps {
  posts: Post[];
  categories: string[];
}

export default function BlogIndex({ posts, categories }: BlogIndexProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);

  // CRITICAL: Set container context for tool scoping
  useContainer(DemoContainers.Blog.id);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
      post.metadata.categories?.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Blog - Supernal Interface | Type-Safe UI Automation</title>
        <meta name="description" content="Insights on type-safe UI automation, AI tool development, and modern testing practices" />
      </Head>

      <div className="min-h-screen bg-gray-50" data-testid={Blog.container}>
        <Header currentPage="blog" onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        
        {/* Hero Header - Mobile Optimized */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
            <div className="flex items-center mb-4 sm:mb-6">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base"
                data-testid={Blog.backButton}
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Back to Home</span>
                <span className="xs:hidden">Back</span>
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">
                Supernal Interface Blog
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
                Insights on type-safe UI automation, AI tool development, and modern testing practices
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Search and Filters - Mobile Optimized */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm sm:text-base focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid={Blog.searchInput}
                />
              </div>

              {/* Category Filter - Horizontal Scroll on Mobile */}
              <div
                className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide"
                data-testid={Blog.categoryFilter}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border transition-all whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                    }`}
                    data-testid={`blog-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles Grid - Mobile Optimized */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 px-1">
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h2>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-base sm:text-lg px-4">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                filteredPosts.length === 1
                  ? 'grid-cols-1 max-w-2xl mx-auto'
                  : filteredPosts.length === 2
                    ? 'grid-cols-1 lg:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {filteredPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} index={index} featured={post.metadata.featured} />
                ))}
              </div>
            )}
          </div>

          {/* More content notice - Mobile Optimized */}
          {posts.length < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                More Articles Coming Soon
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2">
                Stay tuned for more insights on type-safe UI automation, AI agent development,
                and modern testing practices.
              </p>
            </motion.div>
          )}
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

export const getStaticProps: GetStaticProps = async () => {
  const posts = getBlogPosts();
  
  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(
    posts.flatMap(post => post.metadata.categories || [])
  ))];

  return {
    props: {
      posts,
      categories,
    },
  };
};

