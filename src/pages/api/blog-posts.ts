/**
 * Blog Posts API
 * 
 * Returns lightweight blog post metadata for client-side search/navigation
 * This allows AI tools to discover and navigate to specific blog posts
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogPosts } from '../../../lib/content';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const posts = getBlogPosts();
    
    // Return only essential metadata (not full content/HTML)
    const metadata = posts.map(post => ({
      slug: post.slug,
      title: post.metadata.title,
      tags: post.metadata.tags || [],
      categories: post.metadata.categories || [],
      date: post.metadata.date,
      excerpt: post.excerpt
    }));

    res.status(200).json(metadata);
  } catch {
    res.status(500).json({ error: 'Failed to load blog posts' });
  }
}

