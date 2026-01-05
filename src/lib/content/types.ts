export interface Author {
  name: string;
  title?: string;
  image?: string;
  bio?: string;
}

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





