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
    const token =  JSON.parse(localStorage.getItem('authTokens'));
    if (token) {
      config.headers['Authorization'] = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const OderAPI =  {
    
    getOrders: async () => {
        try {
          const response = await api.get('/orders/');
          return response.data;
        } catch (error) {
          console.error('Error fetching Orders:', error);
          throw error;
        }
    },

    addOrder: async () => {
        try {
          const response = await api.post('/orders/');
          return response.data;
        } catch (error) {
          console.error('Error while confirming the order: ', error);
          throw error;
        }
    },
}