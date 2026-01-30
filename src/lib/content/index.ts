import { readDirectoryRecursively, readMarkdownFile } from './filesystem';
import { parseFrontmatter, markdownToHtml, generateExcerpt } from './markdown';
import { generateSlug, getParentSlug, getSectionFromSlug } from './slugs';
import { Doc, DocSection, DocMetadata } from './types';

// ============================================
// Document Cache (Global)
// ============================================
// Caches processed docs to avoid re-reading/parsing on every request.
// Uses globalThis to persist across Next.js API route invocations in dev mode.
// In production: cache lives for the lifetime of the server process.
// In development: cache is invalidated after CACHE_TTL_MS or on explicit clear.

interface DocCache {
  docs: Doc[];
  docsBySlug: Map<string, Doc>;
  timestamp: number;
}

// Use globalThis to persist cache across Next.js dev mode hot reloads
const GLOBAL_CACHE_KEY = '__SUPERNAL_DOC_CACHE__';

function getGlobalCache(): DocCache | null {
  return (globalThis as any)[GLOBAL_CACHE_KEY] || null;
}

function setGlobalCache(cache: DocCache): void {
  (globalThis as any)[GLOBAL_CACHE_KEY] = cache;
}

const CACHE_TTL_MS = process.env.NODE_ENV === 'development' ? 30000 : Infinity; // 30s in dev, forever in prod

/**
 * Check if cache is valid
 */
function isCacheValid(): boolean {
  const cache = getGlobalCache();
  if (!cache) return false;
  if (CACHE_TTL_MS === Infinity) return true;
  return Date.now() - cache.timestamp < CACHE_TTL_MS;
}

/**
 * Clear the document cache (useful for dev/testing)
 */
export function clearDocCache(): void {
  (globalThis as any)[GLOBAL_CACHE_KEY] = null;
  console.log('[DocCache] Cache cleared');
}

/**
 * Get cache stats (for debugging)
 */
export function getDocCacheStats(): { cached: boolean; docCount: number; ageMs: number } {
  const cache = getGlobalCache();
  return {
    cached: cache !== null,
    docCount: cache?.docs.length ?? 0,
    ageMs: cache ? Date.now() - cache.timestamp : 0,
  };
}

/**
 * Process a single markdown file into a Doc object
 */
export async function processMarkdownFile(filePath: string): Promise<Doc | null> {
  try {
    const content = await readMarkdownFile(filePath);
    
    if (!content) {
      return null;
    }
    
    // Parse frontmatter
    const { metadata: parsedMetadata, content: markdownContent, excerpt: frontmatterExcerpt } = parseFrontmatter(content);
    
    // Build metadata, extracting title from heading if not in frontmatter
    const baseMetadata = (parsedMetadata && typeof parsedMetadata === 'object') 
      ? parsedMetadata as Partial<DocMetadata>
      : {};
    
    let title = baseMetadata.title;
    if (!title) {
      const headingMatch = markdownContent.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        title = headingMatch[1].trim();
      } else {
        // Use filename as last resort
        const fileName = filePath.split('/').pop()?.replace(/\.(md|mdx)$/, '') || 'Untitled';
        title = fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    }
    
    const metadata: DocMetadata = {
      ...baseMetadata,
      title,
    };
    
    // Skip draft docs in production
    if (metadata.draft === true && process.env.NODE_ENV === 'production') {
      return null;
    }
    
    // Generate excerpt
    const excerpt = frontmatterExcerpt || generateExcerpt(markdownContent, 160);
    
    // Convert markdown to HTML
    const html = await markdownToHtml(markdownContent);
    
    // Generate slug from file path
    const slug = generateSlug(filePath);
    
    // Determine if this is an index file
    const isIndex = filePath.endsWith('index.md') || filePath.endsWith('index.mdx') || 
                   slug.endsWith('/index') || slug === 'index';
    
    // Get the path segments
    const pathSegments = slug.split('/').filter(Boolean);
    
    // Get the parent slug
    const parentSlug = getParentSlug(slug);
    
    // Get the section ID (first path segment)
    const sectionId = getSectionFromSlug(slug);
    
    // Create the doc object
    const doc: Doc = {
      slug: isIndex ? slug.replace(/\/index$/, '') : slug,
      path: pathSegments,
      content: markdownContent,
      html,
      excerpt,
      metadata,
      childDocs: [],
      parentSlug,
      sectionId,
      sectionName: sectionId,
    };
    
    return doc;
  } catch {
    // Error processing markdown file
    return null;
  }
}

/**
 * Build parent-child relationships between docs
 */
export function buildDocRelationships(docs: Doc[]): Doc[] {
  // Create a map of slugs to docs for quick lookup
  const docMap = new Map<string, Doc>();
  docs.forEach(doc => {
    docMap.set(doc.slug, doc);
  });
  
  // Build parent-child relationships
  docs.forEach(doc => {
    // Find child docs
    const childDocs = docs.filter(d => d.parentSlug === doc.slug);
    doc.childDocs = childDocs;
  });
  
  return docs;
}

/**
 * Get all documentation (with caching)
 *
 * Uses in-memory cache to avoid re-processing all markdown files on every request.
 * Cache TTL: 5s in development, infinite in production.
 */
export async function getAllDocs(): Promise<Doc[]> {
  // Return cached docs if valid
  const existingCache = getGlobalCache();
  if (isCacheValid() && existingCache) {
    return existingCache.docs;
  }

  const startTime = Date.now();

  try {
    const filePaths = await readDirectoryRecursively('');

    // Process all markdown files
    const docsPromises = filePaths.map(async filePath => {
      return await processMarkdownFile(filePath);
    });

    // Wait for all promises to resolve
    const allDocs = (await Promise.all(docsPromises)).filter((doc): doc is Doc => doc !== null);

    // Deduplicate by slug (in case of any duplicate paths)
    const slugMap = new Map<string, Doc>();
    for (const doc of allDocs) {
      if (!slugMap.has(doc.slug)) {
        slugMap.set(doc.slug, doc);
      }
    }
    const docs = Array.from(slugMap.values());

    // Build parent-child relationships
    const processedDocs = buildDocRelationships(docs);

    // Sort by order if specified in frontmatter
    processedDocs.sort((a, b) => {
      const orderA = a.metadata.order ?? 999;
      const orderB = b.metadata.order ?? 999;
      return orderA - orderB;
    });

    // Update global cache
    setGlobalCache({
      docs: processedDocs,
      docsBySlug: slugMap,
      timestamp: Date.now(),
    });

    console.log(`[DocCache] Built cache with ${processedDocs.length} docs in ${Date.now() - startTime}ms`);

    return processedDocs;
  } catch {
    // Error getting all docs
    return [];
  }
}

/**
 * Get docs for a specific section
 */
export async function getSectionDocs(section: string): Promise<Doc[]> {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => doc.sectionId === section);
}

/**
 * Get a specific doc by slug (cache-optimized)
 *
 * Uses the slug map from cache for O(1) lookup instead of O(n) array search.
 */
export async function getDocBySlug(slug: string): Promise<Doc | null> {
  // Ensure cache is populated
  await getAllDocs();

  // Use cached slug map for fast lookup
  const cache = getGlobalCache();
  if (cache?.docsBySlug) {
    return cache.docsBySlug.get(slug) || null;
  }

  return null;
}

/**
 * Get all child docs for a given slug
 */
export async function getChildDocs(slug: string): Promise<Doc[]> {
  const allDocs = await getAllDocs();
  return allDocs.filter(doc => doc.parentSlug === slug);
}

/**
 * Get all sections from the content directory
 */
export async function getSections(): Promise<DocSection[]> {
  try {
    const allDocs = await getAllDocs();
    
    // Section metadata with descriptions
    const sectionDescriptions: Record<string, string> = {
      '': 'Start here for an overview and guided tour',
      'getting-started': 'Quick setup and integration guides',
      'architecture': 'Core concepts and design patterns',
      'testing': 'Testing strategies and patterns',
      'requirements': 'Feature specifications and requirements',
      'planning': 'Roadmaps and development plans',
      'status': 'Current implementation status',
      'research': 'Research and competitive analysis',
      'analysis': 'System analysis and audits',
      'blog': 'Articles and announcements',
    };
    
    // Group docs by section
    const sectionMap = new Map<string, Doc[]>();
    allDocs.forEach(doc => {
      if (doc.sectionId) {
        if (!sectionMap.has(doc.sectionId)) {
          sectionMap.set(doc.sectionId, []);
        }
        sectionMap.get(doc.sectionId)!.push(doc);
      }
    });
    
    // Convert to array of section objects
    return Array.from(sectionMap.entries()).map(([id, docs]) => ({
      id,
      name: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      description: sectionDescriptions[id] || undefined,
      docs: docs.sort((a, b) => (a.metadata.order ?? 999) - (b.metadata.order ?? 999))
    }));
  } catch {
    // Error getting sections
    return [];
  }
}





