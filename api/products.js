import { getCatalog } from './_lib/products.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const allProducts = getCatalog();
  const {
    id, category, search, q, sortBy, sort, flash, trending, recommended, bestSeller,
    page, limit, minRating, maxPrice, inStockOnly, onSaleOnly, relatedTo
  } = req.query;

  // 1. Single product lookup by ID
  if (id) {
    const product = allProducts.find((p) => String(p.id) === String(id));
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  }

  // 2. Related products
  if (relatedTo) {
    const relCat = category;
    const related = allProducts.filter(
      (p) => String(p.id) !== String(relatedTo) && (!relCat || p.category === relCat)
    ).slice(0, Number(limit) || 4);
    return res.status(200).json(related);
  }

  let list = [...allProducts];

  // 3. Category filter
  if (category && category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // 4. Search query
  const queryTerm = (search || q || '').trim().toLowerCase();
  if (queryTerm) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(queryTerm) ||
      p.brand.toLowerCase().includes(queryTerm) ||
      p.category.toLowerCase().includes(queryTerm) ||
      (p.description && p.description.toLowerCase().includes(queryTerm))
    );
  }

  // 5. Badges & flags
  if (flash === 'true' || flash === '1') {
    list = list.filter((p) => p.isFlashSale);
  }

  if (trending === 'true' || trending === '1') {
    list = list.filter((p) => p.isTrending);
  }

  if (recommended === 'true' || recommended === '1') {
    list = list.filter((p) => p.rating >= 4.8);
  }

  if (bestSeller === 'true' || bestSeller === '1') {
    list = list.filter((p) => p.isBestSeller);
  }

  // 6. Availability filters
  if (inStockOnly === 'true' || inStockOnly === '1') {
    list = list.filter((p) => p.stock > 0);
  }

  if (onSaleOnly === 'true' || onSaleOnly === '1') {
    list = list.filter((p) => p.discountPercentage > 0);
  }

  // 7. Rating filter
  if (minRating) {
    list = list.filter((p) => p.rating >= Number(minRating));
  }

  // 8. Price filter
  if (maxPrice) {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }

  // 9. Sorting
  const sortMode = sortBy || sort || 'recommended';
  if (sortMode === 'price-low' || sortMode === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sortMode === 'price-high' || sortMode === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sortMode === 'newest') {
    list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sortMode === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sortMode === 'discount') {
    list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  } else if (sortMode === 'popular') {
    list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  const total = list.length;
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 24;

  // 10. Paginated response when page parameter is present
  if (page) {
    const start = (pageNum - 1) * limitNum;
    const paginated = list.slice(start, start + limitNum);
    return res.status(200).json({
      products: paginated,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  }

  // Unpaginated limit
  if (limit) {
    list = list.slice(0, limitNum);
  }

  return res.status(200).json(list);
}
