/**
 * Blog Index Page - Shows all blog posts as cards
 * Server-side rendered with Next.js Pages Router
 */

import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '../../components/Header';
import { EarlyAccessModal } from '../../components/EarlyAccessModal';
import { getBlogPosts } from '../../lib/content/blog';
import { Post } from '../../lib/content/types';
import BlogCard from '../../components/blog/BlogCard';
import { motion } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import { Blog } from '../../architecture/DemoComponentNames';
import { ChatBubble } from '../../components/chat/ChatBubble';
import { useSharedChat } from '../../hooks/useSharedChat';
import { DemoAIInterface } from '../../lib/AIInterface';
import { ToolManager } from '../../lib/ToolManager';
import { NavigationGraph } from "@supernal/interface/browser";

interface BlogIndexProps {
  posts: Post[];
  categories: string[];
}

export default function BlogIndex({ posts, categories }: BlogIndexProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  
  // Use shared chat interface
  const { messages, addMessage, clearMessages } = useSharedChat();
  const [aiInterface] = useState(() => new DemoAIInterface());

  useEffect(() => {
    // Set up navigation handler
    
    
    // Subscribe to tool execution results
    const unsubscribe = ToolManager.subscribe((result) => {
      const emoji = result.success ? '✅' : '❌';
      addMessage(`${emoji} ${result.message}`, 'ai');
    });
    
    return unsubscribe;
  }, [router, addMessage]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    addMessage(text, 'user');
    
    try {
      const result = await aiInterface.findAndExecuteCommand(text, 'Blog');
      
      if (!result.success) {
        addMessage(result.message, 'system');
      }
    } catch (error) {
      addMessage(`Error: ${error instanceof Error ? error.message : String(error)}`, 'ai');
    }
  };

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
        
        {/* Hero Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center mb-6">
              <button
                onClick={() => router.push('/')}
                className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4"
                data-testid={Blog.backButton}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                Supernal Interface Blog
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Insights on type-safe UI automation, AI tool development, and modern testing practices
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search and Filters */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  data-testid={Blog.searchInput}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2" data-testid={Blog.categoryFilter}>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
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

          {/* Articles Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {selectedCategory === 'All' ? 'Latest Articles' : `${selectedCategory} Articles`}
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
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

          {/* More content notice */}
          {posts.length < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center bg-gray-100 rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                More Articles Coming Soon
              </h3>
              <p className="text-gray-600 max-w-xl mx-auto">
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

