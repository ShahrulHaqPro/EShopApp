import api from './api';

export const productsApi = {
  // Get all products
  getAllProducts: async (limit = 20, sort = 'asc') => {
    try {
      const response = await api.get(`/products?limit=${limit}&sort=${sort}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single product
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/products/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/products/categories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add new product (admin only - simulated)
  addProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update product (admin only)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete product (admin only)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get products with pagination
  getProductsPaginated: async (page = 1, limit = 10) => {
    try {
      const offset = (page - 1) * limit;
      const response = await api.get(`/products?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search products (Fake Store API doesn't have search, so we simulate)
  searchProducts: async (query) => {
    try {
      const allProducts = await api.get('/products');
      const filtered = allProducts.data.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      return filtered;
    } catch (error) {
      throw error;
    }
  },

  // Get featured products (custom logic - top rated or specific category)
  getFeaturedProducts: async () => {
    try {
      const allProducts = await api.get('/products');
      // Simulate featured products (first 4 with rating > 4)
      const featured = allProducts.data
        .filter(product => product.rating.rate > 4)
        .slice(0, 4);
      return featured;
    } catch (error) {
      throw error;
    }
  },

  // Get products sorted by rating
  getTopRatedProducts: async (limit = 5) => {
    try {
      const allProducts = await api.get('/products');
      const sorted = allProducts.data
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, limit);
      return sorted;
    } catch (error) {
      throw error;
    }
  },
};