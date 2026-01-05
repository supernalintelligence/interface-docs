export interface Author {
  name: string;
  title?: string;
  image?: string;
  bio?: string;
}

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

