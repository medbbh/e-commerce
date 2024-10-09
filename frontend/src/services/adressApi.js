// apiService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

export const fetchAddress = async () => {
  return await api.get('/adress/');
};

export const createAddress = async (addressInfo) => {
  return await api.post('/adress/', addressInfo);
};

export const updateAddress = async (addressInfo,id) => {
  return await api.put(`/adress/${id}/`, addressInfo);
};
