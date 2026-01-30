import fs from 'fs';
import path from 'path';

/**
 * Get the root docs directory
 *
 * SECURITY FIX: This function now returns ONLY the content/docs directory.
 * Previously it could expose private documentation from ../../docs.
 * All public documentation should be placed in docs-site/content/docs/
 *
 * @deprecated Use getContentDirectory() instead. This function now returns
 * the same path as getContentDirectory() for backwards compatibility.
 */
export function getDocsRootDirectory(): string {
  // SECURITY: Only serve content from the public content/docs directory
  // Do NOT read from ../../docs as it contains private documentation
  return path.join(process.cwd(), 'content/docs');
}

/**
 * Get the content directory path (for demo-specific content)
 */
export function getContentDirectory(): string {
  return path.join(process.cwd(), 'content/docs');
}

/**
 * Get absolute path for a file in the content directory
 *
 * SECURITY: Only resolves paths within content/docs directory.
 */
export function getAbsolutePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  // Only read from content/docs (public documentation)
  return path.join(getContentDirectory(), filePath);
}

/**
 * Read a markdown file from either location
 */
export async function readMarkdownFile(filePath: string): Promise<string | null> {
  try {
    const absolutePath = getAbsolutePath(filePath);
    
    if (!fs.existsSync(absolutePath)) {
      return null;
    }
    
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return content;
  } catch {
    // Error reading markdown file
    return null;
  }
}

/**
 * Read directory recursively from content/docs
 *
 * SECURITY FIX: Previously read from both content/docs and ../../docs,
 * which exposed private internal documentation. Now only reads from
 * content/docs to ensure only public documentation is served.
 */
export async function readDirectoryRecursively(
  dirPath: string,
  extensions: string[] = ['.md', '.mdx']
): Promise<string[]> {
  const files: string[] = [];
  
  // Helper to read from a specific root
  const readFromRoot = (rootDir: string, subPath: string = '') => {
    try {
      const fullPath = path.join(rootDir, subPath);
      
      if (!fs.existsSync(fullPath)) {
        return;
      }
      
      const entries = fs.readdirSync(fullPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(fullPath, entry.name);
        const relativePath = path.relative(rootDir, entryPath);
        
        if (entry.isDirectory()) {
          // Skip hidden and certain directories
          if (!entry.name.startsWith('.') && 
              !['node_modules', 'archive', 'templates', 'trash'].includes(entry.name)) {
            readFromRoot(rootDir, relativePath);
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(relativePath);
          }
        }
      }
    } catch {
      // Error reading directory
    }
  };
  
  // SECURITY: Only read from content/docs (public documentation)
  readFromRoot(getContentDirectory(), dirPath);

  return files;
}

