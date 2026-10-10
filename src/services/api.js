
const API_URL = import.meta.env.VITE_API_URL || '';

export const apiService = {
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();

      const response = await fetch(
        `${API_URL}/api/products?${query}`
      );

      if (!response.ok) {
        return [];
      }

      const result = await response.json();

      return Array.isArray(result)
        ? result
        : result.products || [];
    } catch {
      return [];
    }
  }
};