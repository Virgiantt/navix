// src/pages/api/sync-pinecone.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { upsertAllProjects } from '@/scripts/upsertProjectsToPinecone';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Optional: Add a secret check for security
  if (req.headers['x-sync-secret'] !== process.env.PINECONE_SYNC_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await upsertAllProjects();
    res.status(200).json({ message: 'Pinecone sync complete!' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}