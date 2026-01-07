import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import { Post, PostMetadata } from './types';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

/**
 * Get all blog posts
 */
export function getBlogPosts(): Post[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data, content } = matter(fileContents);
        const metadata = data as PostMetadata;

        // Generate excerpt (first paragraph)
        const firstParagraph = content.split('\n\n')[0];
        const excerpt = firstParagraph.slice(0, 160).trim() + (firstParagraph.length > 160 ? '...' : '');

        // Convert markdown to HTML synchronously
        const html = unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype)
          .use(rehypeSlug)
          .use(rehypeStringify)
          .processSync(content)
          .toString();

        return {
          slug,
          content,
          html,
          excerpt,
          metadata,
        };
      })
      .filter(post => !post.metadata.draft)
      .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());

    return posts;
  } catch {
    // Error reading blog posts - return empty array
    return [];
  }
}

/**
 * Get a single post by slug
 */
export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const metadata = data as PostMetadata;

    const firstParagraph = content.split('\n\n')[0];
    const excerpt = firstParagraph.slice(0, 160).trim() + (firstParagraph.length > 160 ? '...' : '');

    const html = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeStringify)
      .processSync(content)
      .toString();

    return {
      slug,
      content,
      html,
      excerpt,
      metadata,
    };
  } catch {
    // Error reading post - return null
    return null;
  }
}

