/**
 * Blog Navigation Tools - Uses Dynamic Parameter Extraction
 * Allows users to navigate to blog posts using natural language
 * 
 * IMPORTANT: These tools are GLOBAL and work from any page
 */

import { Tool, ToolProvider, ToolCategory, NavigationGraph } from "@supernalintelligence/interface-enterprise";
import { FuzzyMatcher } from '../lib/FuzzyMatcher';

@ToolProvider({
  category: ToolCategory.NAVIGATION,
  // NO containerId - makes it globally available from any page
  aiEnabled: true
})
export class BlogNavigationTools {
  
  /**
   * Navigate using NavigationGraph (works in browser)
   */
  private navigate(path: string) {
    const nav = NavigationGraph.getInstance();
    console.log('[BlogNavigationTools] navigate() called with path:', path);
    console.log('[BlogNavigationTools] NavigationGraph instance:', nav);
    console.log('[BlogNavigationTools] nav.navigate exists?', !!nav.navigate);
    console.log('[BlogNavigationTools] nav.getNavigationHandler():', nav.getNavigationHandler?.());

    if (nav.navigate) {
      console.log('[BlogNavigationTools] Calling nav.navigate(path)...');
      nav.navigate(path);
      console.log('[BlogNavigationTools] nav.navigate() returned');
    } else {
      console.error('[BlogNavigationTools] NavigationGraph.navigate() not available. Ensure setNavigationHandler() was called in _app.tsx');
    }
  }
  
  /**
   * Navigate to blog with optional post search
   * 
   * This is a PROGRAMMATIC tool with NO elementId.
   * It works purely through code, not DOM elements.
   * 
   * Examples:
   * - "open blog" → Goes to /blog index
   * - "open blog name contracts" → Finds and opens "What's In a Name?" post
   * - "show blog boilerplate" → Finds and opens "80% Less Boilerplate" post
   * - "view blog testing" → Finds and opens "Type-Safe UI Testing" post
   */
  @Tool({
    // NO elementId - this is a programmatic navigation tool
    name: 'navigateToBlog',
    description: 'Navigate to blog index or specific blog post by title/topic',
    category: ToolCategory.NAVIGATION,
    aiEnabled: true,
    dangerLevel: 'safe',
    examples: [
      'open blog',
      'open blog {title}',
      'show blog',
      'show blog {title}',
      'view blog',
      'view blog {title}',
      'go to blog',
      'blog {title}'
    ]
  })
  async openBlog(query?: string) {
    const targetPath = '/blog';

    // If no query, just go to blog index
    if (!query || query.trim() === '') {
      // Return pending status first - navigation handler will confirm completion
      const result = {
        success: true,
        message: 'Navigating to Blog...',
        pending: true,  // Indicates navigation is in progress
        action: 'navigation',
        path: targetPath
      };

      // Start navigation (async - will complete after this returns)
      this.navigate(targetPath);

      return result;
    }

    // Fetch blog posts from API route (server-side, works in browser)
    try {
      const response = await fetch('/api/blog-posts');
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }
      
      const posts = await response.json();

      // Search for matching blog post
      interface BlogPost {
        title: string;
        slug: string;
        tags?: string[];
        categories?: string[];
      }
      
      const post = FuzzyMatcher.findBest(
        posts,
        query,
        (p: BlogPost) => [
          p.title,
          p.slug,
          ...(p.tags || []),
          ...(p.categories || [])
        ]
      );

      if (post) {
        const postPath = `/blog/${post.slug}`;
        this.navigate(postPath);
        return {
          success: true,
          message: `Opening: ${post.title}...`,
          pending: true,
          action: 'navigation',
          path: postPath,
          post: {
            title: post.title,
            slug: post.slug
          }
        };
      }

      // Not found - show all matches
      const allMatches = FuzzyMatcher.findAll(posts, query, (p: BlogPost) => [
        p.title,
        ...(p.tags || [])
      ]);

      if (allMatches.length > 0) {
        return {
          success: false,
          message: `No exact match for "${query}". Did you mean: ${allMatches.slice(0, 3).map((p: BlogPost) => p.title).join(', ')}?`,
          suggestions: allMatches.slice(0, 3).map((p: BlogPost) => ({
            title: p.title,
            slug: p.slug
          }))
        };
      }

      return { 
        success: false, 
        message: `No blog post found matching: "${query}"`,
        action: 'navigation',
        path: '/blog'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error loading blog posts: ${error}`,
        path: '/blog'
      };
    }
  }
}

// Instantiate to register tools with instance methods
new BlogNavigationTools();

