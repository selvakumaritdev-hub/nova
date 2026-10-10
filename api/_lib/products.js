// Complete 540 products catalog for Nova Mall Vercel API
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
let cachedCatalog = null;

export const getCatalog = () => {
  if (cachedCatalog && cachedCatalog.length > 0) return cachedCatalog;

  try {
    cachedCatalog = require('../../data/products.json');
    if (Array.isArray(cachedCatalog) && cachedCatalog.length > 0) {
      return cachedCatalog;
    }
  } catch (err) {
    // Fallback to fs read
  }

  try {
    const p = path.resolve(process.cwd(), 'data', 'products.json');
    if (fs.existsSync(p)) {
      cachedCatalog = JSON.parse(fs.readFileSync(p, 'utf8'));
      return cachedCatalog;
    }
  } catch (err) {
    console.error('Error reading catalog:', err);
  }

  return cachedCatalog || [];
};

export const CATALOG_PRODUCTS = getCatalog();

