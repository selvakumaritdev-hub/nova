import { db } from './_lib/db.js';
import { verifyAdminAuth } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET EVENTS (Owner Protected)
  if (req.method === 'GET') {
    const auth = verifyAdminAuth(req);
    if (!auth.valid) {
      return res.status(401).json({ error: 'Owner authorization required to view live activity feed' });
    }

    const limit = Number(req.query.limit) || 200;
    const events = await db.getEvents(limit);
    return res.status(200).json(events);
  }

  // 2. POST EVENT (Public Activity Tracking from Shop)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { type, user, data } = body;

      if (!type || typeof type !== 'string') {
        return res.status(400).json({ error: 'Event type is required' });
      }

      const event = await db.createEvent({
        type,
        user: user || null,
        data: data || {}
      });

      return res.status(201).json({ ok: true, event });
    } catch (err) {
      console.error('Track event error:', err);
      return res.status(400).json({ error: 'Failed to record event' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
