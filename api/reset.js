import { db } from './_lib/db.js';
import { verifyAdminAuth } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = verifyAdminAuth(req);
  if (!auth.valid) {
    return res.status(401).json({ error: 'Owner authorization required to reset database' });
  }

  try {
    await db.reset();
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Reset error:', err);
    return res.status(500).json({ error: 'Failed to reset data' });
  }
}
