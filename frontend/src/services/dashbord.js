import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the access token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem('authTokens'));
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const dashboardService = {
  // 1️⃣ Sales Trends (Line Chart Data)
  getSalesTrends: async () => {
    try {
      const response = await api.get('/dashboard/sales-trends/');
      return response.data;
    } catch (error) {
      console.error('Error fetching sales trends:', error);
      throw error;
    }
  },

  // 2️⃣ Top Products (Table Data)
  getTopProducts: async () => {
    try {
      const response = await api.get('/dashboard/top-products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching top products:', error);
      throw error;
    }
  },

  // 3️⃣ Order Status Distribution (Pie Chart)
  getOrderStatusDistribution: async () => {
    try {
      const response = await api.get('/dashboard/order-status-distribution/');
      return response.data;
    } catch (error) {
      console.error('Error fetching order status distribution:', error);
      throw error;
    }
  },

  // 4️⃣ Recent Orders (Table Data)
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
