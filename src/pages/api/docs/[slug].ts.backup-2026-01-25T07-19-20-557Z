import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocBySlug } from '../../../lib/content';
import { Doc } from '../../../lib/content/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Doc | { error: string }>
) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    // Use cache-optimized getDocBySlug for O(1) lookup
    const doc = await getDocBySlug(slug);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Cache headers for browser caching (1 min in dev, 5 min in prod)
    const maxAge = process.env.NODE_ENV === 'development' ? 60 : 300;
    res.setHeader('Cache-Control', `public, s-maxage=${maxAge}, stale-while-revalidate`);

    res.status(200).json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to load document' });
  }
}
