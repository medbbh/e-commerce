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
    const token = JSON.parse(localStorage.getItem('authTokens'));
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.access}`; // ✅ Fixed Syntax
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const OrderAPI = {
  
  getOrders: async () => {
    try {
      const response = await api.get('/orders/');
      return response.data;
    } catch (error) {
      console.error('Error fetching Orders:', error);
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await api.get('/orders/all-orders/');
      return response.data;
    } catch (error) {
      console.error('Error fetching Orders:', error);
      throw error;
    }
  },

  // without payment
  // addOrder: async () => {
  //   try {
  //     const response = await api.post('/orders/', {
  //       // shipping_address: orderData.shipping_address,
  //       // notes: orderData.notes || '',
  //       // status: 'Pending', // Default status
  //     });
  //     return response.data;
  //   } catch (error) {
  //     if (error.response) {
  //       console.error('Error response:', error.response.data);
  //       throw new Error(
  //         error.response.data.detail || 
  //         error.response.data.error || 
  //         'Failed to create order'
  //       );
  //     }
  //     console.error('Error while confirming the order: ', error);
  //     throw error;
  //   }
  // },

  // Finalize the order by providing the payment ID to the backend.
  finalizeOrder: (paymentId) =>
    api.post("http://localhost:8000/api/orders/finalize-order/", { payment_id: paymentId }),

  updateOrderStatus: async (orderId, data) => {
    try {
      const response = await api.patch(`/orders/${orderId}/update-status/`, data); // ✅ Fixed URL
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(
          error.response.data.error || 
          'Failed to update order status'
        );
      }
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  getDeliveryInfo: async (userId) => {
    try {
      const response = await api.get(`/adress/user/${userId}/`); // ✅ Fixed URL
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(
          error.response.data.error || 
          'Failed to fetch delivery info'
        );
      }
      console.error('Error fetching delivery info:', error);
      throw error;
    }
  },
};
