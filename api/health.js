import { isSupabaseConfigured } from './_lib/db.js';

export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    ok: true,
    service: 'Nova Mall Production API',
    database: isSupabaseConfigured ? 'supabase' : 'fallback-memory',
    supabaseConnected: isSupabaseConfigured,
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
}
