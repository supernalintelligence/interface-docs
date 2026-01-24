/**
 * Dynamic Blog Post Page - [slug].tsx
 * Renders individual blog posts with Loopora-style layout
 */

import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, User, Clock } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { EarlyAccessModal } from '../../components/EarlyAccessModal';
import { getBlogPosts, getPostBySlug } from '../../lib/content/blog';
import { Post } from '../../lib/content/types';
import { useCodeBlockEnhancement } from '../../components/blog/CodeBlock';
import { TableOfContents } from '../../components/blog/TableOfContents';

interface BlogPostProps {
  post: Post;
}

// Helper to format date safely
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export default function BlogPost({ post }: BlogPostProps) {
  const router = useRouter();
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  
  // Add copy buttons to code blocks
  useCodeBlockEnhancement();

  if (!post) {
    return <div>Post not found</div>;
  }

  const getHeaderStyle = () => {
    switch (post.metadata.headerStyle) {
      case 'hero':
        return 'bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-blue-600/20';
      case 'gradient':
        return 'bg-gradient-to-r from-blue-600 to-purple-600';
      case 'minimal':
        return 'bg-white';
      default:
        return 'bg-gray-50';
    }
  };

  const getTextColor = () => {
    return post.metadata.headerStyle === 'gradient' ? 'text-white' : 'text-gray-900';
  };

  const getSubtextColor = () => {
    return post.metadata.headerStyle === 'gradient' ? 'text-white/90' : 'text-gray-600';
  };

  return (
    <>
      <Head>
        <title>{post.metadata.title} | Supernal Interface Blog</title>
        <meta name="description" content={post.metadata.description || post.excerpt} />
      </Head>

      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <Header currentPage="blog" onEarlyAccessClick={() => setShowEarlyAccessModal(true)} />
        
        {/* Hero Header */}
        <div className={`${getHeaderStyle()} border-b border-gray-200 pt-6`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => router.push('/blog')}
                className={`flex items-center ${getSubtextColor()} hover:${getTextColor()} transition-colors text-sm`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </button>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${getTextColor()} mb-6 leading-tight`}>
                {post.metadata.title}
              </h1>

              {/* Subheader */}
              {post.metadata.subheader && (
                <p className={`text-xl ${getSubtextColor()} mb-8 leading-relaxed max-w-3xl`}>
                  {post.metadata.subheader}
                </p>
              )}

              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {post.metadata.author && (
                  <div className={`flex items-center ${getSubtextColor()}`}>
                    <User className="h-4 w-4 mr-2" />
                    <span>
                      {typeof post.metadata.author === 'string' 
                        ? post.metadata.author 
                        : post.metadata.author.name
                      }
                    </span>
                  </div>
                )}

                <div className={`flex items-center ${getSubtextColor()}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formatDate(post.metadata.date)}</span>
                </div>

                {post.metadata.readingTime && (
                  <div className={`flex items-center ${getSubtextColor()}`}>
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{post.metadata.readingTime}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.metadata.tags && post.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {post.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        post.metadata.headerStyle === 'gradient'
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Content with TOC */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-8"
              >
                <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* TTS Widget wrapper for blog content */}
                  <div 
                    className={`prose prose-slate max-w-none p-4 sm:p-6 md:p-8 lg:p-12 ${post.metadata.tts?.enabled ? 'supernal-tts-widget' : ''}`}
                    data-text={post.metadata.tts?.enabled ? post.content : undefined}
                    data-voice="alloy"
                    data-provider={post.metadata.tts?.provider || 'openai'}
                    data-speed={post.metadata.tts?.speed || 1.0}
                    data-enable-speed="true"
                    data-enable-progress="true"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                  />
                </article>
                
                <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
                  <p>
                    Questions or feedback?{' '}
                    <a 
                      href="https://github.com/supernalintelligence/interface" 
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open an issue on GitHub
                    </a>
                  </p>
                </div>
              </motion.div>

              {/* Table of Contents Sidebar */}
              <aside className="hidden lg:block lg:col-span-4">
                <TableOfContents />
              </aside>
            </div>
          </div>
        </div>
        
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

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getBlogPosts();
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params?.slug as string);
  
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};

