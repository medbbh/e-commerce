
import axios from 'axios';

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

export const PaymentAPI = {
  createPaymentIntent: () =>
    api.post("http://localhost:8000/api/payments/create-payment-intent/",)
};
