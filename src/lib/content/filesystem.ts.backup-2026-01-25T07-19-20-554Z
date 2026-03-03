import fs from 'fs';
import path from 'path';

/**
 * Get the root docs directory
 * Tries multiple paths to handle local dev vs Vercel deployment
 */
export function getDocsRootDirectory(): string {
  const possiblePaths = [
    path.join(process.cwd(), '../../docs'),           // Local: demo -> core -> @supernal-interface/docs
    path.join(process.cwd(), '../docs'),              // Vercel with include outside root
    path.join(__dirname, '../../../../docs'),         // Relative to this file
  ];
  
  for (const docsPath of possiblePaths) {
    if (fs.existsSync(docsPath)) {
      return docsPath;
    }
  }
  
  // No docs directory found - return the expected path anyway (will be empty)
  return path.join(process.cwd(), '../../docs');
}

/**
 * Get the content directory path (for demo-specific content)
 */
export function getContentDirectory(): string {
  return path.join(process.cwd(), 'content/docs');
}

/**
 * Get absolute path for a file, checking both locations
 */
export function getAbsolutePath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  
  // Check content/docs first (demo-specific)
  const contentPath = path.join(getContentDirectory(), filePath);
  if (fs.existsSync(contentPath)) {
    return contentPath;
  }
  
  // Fall back to ../../docs (shared docs)
  return path.join(getDocsRootDirectory(), filePath);
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
 * Read directory recursively from BOTH content/docs and ../../docs
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
  
  // Read from both locations
  readFromRoot(getContentDirectory(), dirPath);
  readFromRoot(getDocsRootDirectory(), dirPath);
  
  // Remove duplicates
  return Array.from(new Set(files));
}

