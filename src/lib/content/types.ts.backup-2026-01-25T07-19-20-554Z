/**
 * Unified Content Types
 * 
 * This file consolidates all content-related types for both:
 * - Blog posts (lib/content/)
 * - Documentation (src/lib/content/)
 */

// ============================================================================
// Common Types
// ============================================================================

export interface Author {
  name: string;
  title?: string;
  image?: string;
  bio?: string;
}

export interface TTSConfig {
  enabled?: boolean;
  voice?: string;
  voices?: string[];
  provider?: string;
  speed?: number;
  enableSpeed?: boolean;
  enableProgress?: boolean;
}

// ============================================================================
// Blog Post Types (used by lib/content/)
// ============================================================================

export interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  subheader?: string;
  categories?: string[];
  tags?: string[];
  draft?: boolean;
  image?: string;
  author?: Author | string;
  coverImage?: { url: string; alt?: string; caption?: string; } | string;
  readingTime?: string;
  featured?: boolean;
  template?: 'default' | 'feature' | 'technical' | 'announcement';
  headerStyle?: 'minimal' | 'hero' | 'gradient';
  showToc?: boolean;
  showBreadcrumbs?: boolean;
  tts?: TTSConfig;
}

export interface Post {
  slug: string;
  content: string;
  html: string;
  excerpt: string;
  metadata: PostMetadata;
}

export interface BlogSection {
  id: string;
  name: string;
  description?: string;
  posts: Post[];
}

// ============================================================================
// Documentation Types (used by src/lib/content/)
// ============================================================================

export interface DocMetadata {
  title: string;
  description?: string;
  date?: string;
  author?: Author | string;
  category?: string;
  tags?: string[];
  draft?: boolean;
  order?: number; // For sidebar ordering
  showToc?: boolean;
  showBreadcrumbs?: boolean;
  tts?: TTSConfig;
}

export interface Doc {
  slug: string;
  path: string[];
  content: string;
  html: string;
  excerpt: string;
  metadata: DocMetadata;
  childDocs: Doc[];
  parentSlug?: string;
  sectionId?: string;
  sectionName?: string;
}

export interface DocSection {
  id: string;
  name: string;
  description?: string;
  docs: Doc[];
  order?: number;
}
