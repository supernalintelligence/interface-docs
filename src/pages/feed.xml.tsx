/**
 * RSS Feed alias - redirects to /rss.xml
 * Some RSS readers expect /feed.xml
 */

// Re-export from rss.xml
export { default, getServerSideProps } from './rss.xml';
