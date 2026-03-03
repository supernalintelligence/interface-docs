/**
 * Generate a slug from a file path
 */
export function generateSlug(filePath: string): string {
  // Remove file extension
  const withoutExt = filePath.replace(/\.(md|mdx)$/, '');
  
  // Convert to lowercase and replace spaces/special chars with hyphens
  const slug = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9/]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return slug;
}

/**
 * Get parent slug from a slug
 */
export function getParentSlug(slug: string): string | undefined {
  const segments = slug.split('/').filter(Boolean);
  if (segments.length <= 1) {
    return undefined;
  }
  return segments.slice(0, -1).join('/');
}

/**
 * Get section from slug (first segment)
 */
export function getSectionFromSlug(slug: string): string {
  const segments = slug.split('/').filter(Boolean);
  return segments[0] || '';
}

/**
 * Check if slug is an index slug
 */
export function isIndexSlug(slug: string): boolean {
  return slug.endsWith('/index') || slug === 'index';
}
