import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/products';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ProductApi = {
  // Get all products
  getAllProducts: (page = 0, size = 10, sortBy = 'id', sortDirection = 'desc') => {
    return api.get('', {
      params: { page, size, sortBy, sortDirection }
    });
  },

  // Get single product
  getProductById: (id) => {
    return api.get(`/${id}`);
  },

  // Create product
  createProduct: (productData) => {
    return api.post('', productData);
  },

  // Update product
  updateProduct: (id, productData) => {
    return api.put(`/${id}`, productData);
  },

  // Delete product
  deleteProduct: (id) => {
    return api.delete(`/${id}`);
  },

  // Search products
  searchProducts: (keyword, page = 0, size = 10) => {
    return api.get('/search', { params: { keyword, page, size } });
  },

  // Filter by price range
  filterByPriceRange: (minPrice, maxPrice, page = 0, size = 10) => {
    return api.get('/filter/price-range', { params: { minPrice, maxPrice, page, size } });
  },

  // Get low stock products
  getLowStockProducts: (threshold, page = 0, size = 10) => {
    return api.get('/filter/low-stock', { params: { threshold, page, size } });
  },
};

export default ProductApi;