/**
 * RSS Feed for Supernal Interface blog
 * Returns XML feed at /rss.xml
 */

import { GetServerSideProps } from 'next';
import { getBlogPosts } from '../lib/content/blog';

const SITE_URL = 'https://interface.supernal.ai';
const SITE_TITLE = 'Supernal Interface Blog';
const SITE_DESCRIPTION = 'Insights on type-safe UI automation, AI tool development, and modern testing practices';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getAuthorName(author: { name: string } | string | undefined): string {
  if (!author) return 'Supernal Team';
  if (typeof author === 'string') return author;
  return author.name;
}

function generateRssFeed(posts: ReturnType<typeof getBlogPosts>): string {
  const items = posts.map(post => {
    const pubDate = post.metadata.date
      ? new Date(post.metadata.date).toUTCString()
      : new Date().toUTCString();
    
    const link = `${SITE_URL}/blog/${post.slug}`;
    const title = escapeXml(post.metadata.title || post.slug);
    const description = escapeXml(
      post.metadata.description || 
      post.excerpt || 
      ''
    );
    const author = getAuthorName(post.metadata.author);

    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      <author>${escapeXml(author)}</author>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;
}

// This page doesn't render anything - it's just for the SSR response
function RssFeed() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getBlogPosts();
  const rssFeed = generateRssFeed(posts);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.write(rssFeed);
  res.end();

  return {
    props: {},
  };
};

export default RssFeed;
