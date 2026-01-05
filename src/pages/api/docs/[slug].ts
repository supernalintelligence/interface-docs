import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllDocs } from '../../../lib/content';
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
    const allDocs = await getAllDocs();
    const doc = allDocs.find(d => d.slug === slug);

    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json(doc);
  } catch {
    res.status(500).json({ error: 'Failed to load document' });
  }
}
