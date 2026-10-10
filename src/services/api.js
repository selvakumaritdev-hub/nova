import { fallbackProducts } from '../data/productsFallback';

const API_URL = import.meta.env.VITE_API_URL || '';

const filterFallback = (params = {}) => {
  let list = [...fallbackProducts];

  if (params.category && params.category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
  }

  const query = (params.search || params.q || '').trim().toLowerCase();
  if (query) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
    );
  }

  if (params.flash === 'true' || params.flash === true) {
    list = list.filter((p) => p.isFlashSale);
  }

  if (params.trending === 'true' || params.trending === true) {
    list = list.filter((p) => p.isTrending);
  }

  if (params.recommended === 'true' || params.recommended === true) {
    list = list.filter((p) => p.rating >= 4.8);
  }

  if (params.bestSeller === 'true' || params.bestSeller === true) {
    list = list.filter((p) => p.isBestSeller);
  }

  if (params.inStockOnly === 'true' || params.inStockOnly === true) {
    list = list.filter((p) => p.stock > 0);
  }

  if (params.onSaleOnly === 'true' || params.onSaleOnly === true) {
    list = list.filter((p) => p.discountPercentage > 0);
  }

  if (params.minRating) {
    list = list.filter((p) => p.rating >= Number(params.minRating));
  }

  if (params.maxPrice) {
    list = list.filter((p) => p.price <= Number(params.maxPrice));
  }

  if (params.primeOnly === 'true' || params.primeOnly === true) {
    list = list.filter((p) => p.isPrimeDelivery || p.price > 5000);
  }

  const sort = params.sortBy || params.sort || 'recommended';
  if (sort === 'price-low' || sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high' || sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'newest') {
    list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
  } else if (sort === 'popular') {
    list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  const total = list.length;
  const pageNum = Number(params.page) || 1;
  const limitNum = Number(params.limit) || 24;

  if (params.page) {
    const start = (pageNum - 1) * limitNum;
    return {
      products: list.slice(start, start + limitNum),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    };
  }

  if (params.limit) {
    list = list.slice(0, limitNum);
  }

  return list;
};

export const apiService = {
  async getProducts(params = {}) {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      const query = new URLSearchParams(cleanParams).toString();
      const response = await fetch(`${API_URL}/api/products?${query}`);

      if (!response.ok) {
        return filterFallback(params);
      }

      const result = await response.json();
      if (params.page && result && typeof result === 'object' && Array.isArray(result.products)) {
        return result;
      }
      if (params.page && Array.isArray(result)) {
        const pageNum = Number(params.page) || 1;
        const limitNum = Number(params.limit) || 24;
        const start = (pageNum - 1) * limitNum;
        return {
          products: result.slice(start, start + limitNum),
          total: result.length,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(result.length / limitNum)
        };
      }
      if (Array.isArray(result)) {
        return result.length > 0 ? result : filterFallback(params);
      }
      if (result.products && Array.isArray(result.products)) {
        return result.products;
      }
      return filterFallback(params);
    } catch {
      return filterFallback(params);
    }
  },

  async getProductById(id) {
    if (!id) return null;
    try {
      const response = await fetch(`${API_URL}/api/products?id=${encodeURIComponent(id)}`);
      if (response.ok) {
        const result = await response.json();
        if (result && result.id) return result;
      }
    } catch {
      // Fallback
    }
    return fallbackProducts.find((p) => String(p.id) === String(id)) || null;
  },

  async getRelatedProducts(category, currentId, limit = 4) {
    try {
      const response = await fetch(
        `${API_URL}/api/products?relatedTo=${encodeURIComponent(currentId)}&category=${encodeURIComponent(category || '')}&limit=${limit}`
      );
      if (response.ok) {
        const result = await response.json();
        const list = Array.isArray(result) ? result : result.products || [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }
    return fallbackProducts
      .filter((p) => String(p.id) !== String(currentId) && (!category || p.category === category))
      .slice(0, limit);
  },

  async getFlashSaleProducts(limit = 8) {
    try {
      const response = await fetch(`${API_URL}/api/products?flash=true&limit=${limit}`);
      if (response.ok) {
        const result = await response.json();
        const list = Array.isArray(result) ? result : result.products || [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }
    return fallbackProducts.filter((p) => p.isFlashSale).slice(0, limit);
  },

  async getTrendingProducts(limit = 8) {
    try {
      const response = await fetch(`${API_URL}/api/products?trending=true&limit=${limit}`);
      if (response.ok) {
        const result = await response.json();
        const list = Array.isArray(result) ? result : result.products || [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }
    return fallbackProducts.filter((p) => p.isTrending).slice(0, limit);
  },

  async getRecommendedProducts(limit = 8) {
    try {
      const response = await fetch(`${API_URL}/api/products?recommended=true&limit=${limit}`);
      if (response.ok) {
        const result = await response.json();
        const list = Array.isArray(result) ? result : result.products || [];
        if (list.length > 0) return list;
      }
    } catch {
      // Fallback
    }
    return fallbackProducts.filter((p) => p.rating >= 4.8).slice(0, limit);
  }
};