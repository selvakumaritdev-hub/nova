// Secure Owner Authentication & Authorization for Nova Mall Admin
import crypto from 'node:crypto';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'nova_mall_super_secret_owner_key_2026_xyz';
const OWNER_EMAIL = (process.env.ADMIN_EMAIL || 'selvakumar.itdev@gmail.com').toLowerCase();
const OWNER_PASSWORD = process.env.ADMIN_PASSWORD || 'NovaMall@Admin2026!';
const OWNER_NAME = 'Selva Kumar';

const base64UrlEncode = (str) =>
  Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return Buffer.from(base64, 'base64').toString('utf8');
};

export const createToken = (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600 // 7 days expiration
    })
  );

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
};

export const verifyToken = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Constant time comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
};

export const validateOwnerCredentials = (email, password) => {
  if (!email || !password) return false;
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPass = String(password).trim();

  // Allow predefined owner credentials or environment overrides
  if (cleanEmail === OWNER_EMAIL && cleanPass === OWNER_PASSWORD) {
    return {
      id: 'owner-selva',
      name: OWNER_NAME,
      email: OWNER_EMAIL,
      role: 'owner'
    };
  }

  // Also support secondary owner login if admin email is admin@novamall.com
  if (cleanEmail === 'admin@novamall.com' && cleanPass === OWNER_PASSWORD) {
    return {
      id: 'owner-admin',
      name: 'Store Owner',
      email: 'admin@novamall.com',
      role: 'owner'
    };
  }

  return null;
};

export const extractBearerToken = (req) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return null;
};

export const verifyAdminAuth = (req) => {
  const token = extractBearerToken(req);
  if (!token) return { valid: false, error: 'Authorization token required' };

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'owner') {
    return { valid: false, error: 'Invalid or expired owner session' };
  }

  return { valid: true, admin: payload };
};
