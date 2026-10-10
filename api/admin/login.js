import { validateOwnerCredentials, createToken } from '../_lib/auth.js';
import { db } from '../_lib/db.js';

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

  try {
    const { email, password } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    const owner = validateOwnerCredentials(email, password);
    if (!owner) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid owner credentials. Please verify your email and password.'
      });
    }

    const token = createToken({
      sub: owner.id,
      name: owner.name,
      email: owner.email,
      role: 'owner'
    });

    // Record owner login event
    await db.createEvent({
      type: 'login',
      user: { name: owner.name, email: owner.email },
      data: { method: 'admin_portal' }
    });

    return res.status(200).json({
      ok: true,
      token,
      owner: {
        name: owner.name,
        email: owner.email,
        role: owner.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(400).json({ ok: false, error: 'Invalid request' });
  }
}
