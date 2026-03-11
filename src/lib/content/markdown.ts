import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import { DocMetadata } from './types';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';

/**
 * Rehype plugin to rewrite relative markdown links to web routes.
 * Fixes links like "./introduction" → "/docs/introduction"
 * and removes leaked filesystem paths like "/var/task/docs/"
 */
function rehypeFixLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && node.properties?.href) {
        let href = String(node.properties.href);
        
        // Fix leaked filesystem paths (e.g., /var/task/docs/introduction)
        if (href.includes('/var/task/')) {
          href = href.replace(/.*\/var\/task\/docs\//, '/docs/');
        }
        
        // Convert relative .md/.mdx links to clean routes
        // ./introduction.md → /docs/introduction
        // ../guides/foo.md → /docs/guides/foo
        if (href.startsWith('./') || href.startsWith('../')) {
          href = href.replace(/\.(md|mdx)$/, '');
          // For relative links starting with ./, assume they're docs
          if (href.startsWith('./')) {
            href = '/docs/' + href.slice(2).replace(/^\/+/, '');
          }
          // For ../ links, we can't resolve without context, leave as-is for now
        }
        
        // Remove trailing slashes from internal links
        if (href.startsWith('/') && href.endsWith('/') && href.length > 1) {
          href = href.slice(0, -1);
        }
        
        node.properties.href = href;
      }
    });
  };
}

export function parseFrontmatter(content: string): {
  metadata: DocMetadata;
  content: string;
  excerpt: string;
} {
  // Check if the content contains frontmatter (starts with ---)
  const hasFrontmatter = content.trim().startsWith('---');
  
  if (!hasFrontmatter) {
    // Return with minimal metadata for files without frontmatter
    return {
      metadata: {
        title: '',
      } as DocMetadata,
      content: content,
      excerpt: '',
    };
  }
  
  const { data, content: markdownContent, excerpt } = matter(content, {
    excerpt: true,
    excerpt_separator: '<!-- excerpt -->',
  });

  // Process metadata arrays that might be strings from YAML
  const processMetadataArray = (field: unknown): string[] => {
    if (Array.isArray(field)) {
      return field;
    } else if (typeof field === 'string') {
      return field.split(',').map((s) => s.trim());
    }
    return [];
  };

  // Process specific fields that might be strings but need to be arrays
  if (data.categories && !Array.isArray(data.categories)) {
    data.categories = processMetadataArray(data.categories);
  }
  if (data.tags && !Array.isArray(data.tags)) {
    data.tags = processMetadataArray(data.tags);
  }

  const metadata = data as DocMetadata;
  return {
    metadata,
    content: markdownContent,
    excerpt: excerpt || '',
  };
}

/**
 * Convert markdown to HTML
 * @param content The markdown content to convert
 * @returns The HTML content
 */
export async function markdownToHtml(content: string): Promise<string> {
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSlug) // Add IDs to headings
      .use(rehypeHighlight, {
        detect: true,
        ignoreMissing: true,
        subset: ['typescript', 'javascript', 'jsx', 'tsx', 'bash', 'json', 'css', 'html']
      })
      .use(rehypeFixLinks)
      .use(rehypeSanitize, {
        ...defaultSchema,
        attributes: {
          ...defaultSchema.attributes,
          'h1,h2,h3,h4,h5,h6': [
            ...(defaultSchema.attributes?.['h1,h2,h3,h4,h5,h6'] || []),
            'id'
          ],
          a: [
            ...(defaultSchema.attributes?.a || []),
            'id',
            'href',
            'target',
            'rel'
          ],
          code: [
            ...(defaultSchema.attributes?.code || []),
            'className'
          ],
          span: [
            ...(defaultSchema.attributes?.span || []),
            'className'
          ]
        },
        tagNames: [
          ...(defaultSchema.tagNames || []),
          'span'
        ]
      })
      .use(rehypeStringify);

    const result = await processor.process(content);
    return result.toString();
  } catch (error) {
    return `<div class="error">Error converting markdown to HTML: ${error instanceof Error ? error.message : String(error)}</div>`;
  }
}

/**
 * Generate an excerpt from markdown content
 * @param content The markdown content to generate an excerpt from
 * @param maxLength The maximum length of the excerpt
 * @returns The generated excerpt
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Check for the more tag
  let moreTagIndex = content.indexOf('<!--more-->');
  if (moreTagIndex === -1) {
    moreTagIndex = content.indexOf('<!-- more -->');
  }
  
  let excerptMarkdown = '';
  
  if (moreTagIndex !== -1) {
    // Get the content before the more tag
    excerptMarkdown = content.slice(0, moreTagIndex).trim();
  } else {
    // Otherwise, use the first paragraph or a portion of it
    const firstParagraphMatch = content.match(/^(.*?)(?:\n\n|$)/);
    if (firstParagraphMatch && firstParagraphMatch[1]) {
      const firstParagraph = firstParagraphMatch[1].trim();
      
      // Calculate length without markdown formatting
      const plainText = firstParagraph
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text
        .replace(/[*_~`#]/g, ''); // Remove markdown markers
      
      if (plainText.length <= maxLength) {
        excerptMarkdown = firstParagraph;
      } else {
        // Find a good breaking point
        let currentLength = 0;
        let breakIndex = firstParagraph.length;
        
        for (let i = 0; i < firstParagraph.length; i++) {
          const char = firstParagraph[i];
          
          // Skip markdown formatting characters for length calculation
          if (!['*', '_', '~', '`', '#'].includes(char)) {
            currentLength++;
          }
          
          if (currentLength > maxLength - 3) {
            // Find the last space before this point
            const lastSpace = firstParagraph.lastIndexOf(' ', i);
            if (lastSpace !== -1) {
              breakIndex = lastSpace;
            } else {
              breakIndex = i;
            }
            break;
          }
        }
        
        excerptMarkdown = firstParagraph.slice(0, breakIndex).trim() + '...';
      }
    }
  }
  
  return excerptMarkdown || '';
}
