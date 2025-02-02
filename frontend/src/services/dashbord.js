import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('authTokens')); // Assuming authTokens is stored in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.access}`; // Add the access token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiService = {
  // Sales Trends API (Line chart data for sales trends)
  getSalesTrends: async () => {
    try {
      const response = await api.get('/dashboard/sales-trends/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },

  // Top Products API (Get top ordered products)
  getTopProducts: async () => {
    try {
      const response = await api.get('/dashboard/top-products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // Marketing Effectiveness API (Get today's visitor count)
  getMarketingEffectiveness: async () => {
    try {
      const response = await api.get('/dashboard/marketing-effectiveness/');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing effectiveness:', error);
      throw error;
    }
  },

  // Recent Orders API (Get the most recent orders)
  getRecentOrders: async () => {
    try {
      const response = await api.get('/dashboard/recent-orders/');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      throw error;
    }
  },
};
