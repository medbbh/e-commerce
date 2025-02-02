import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://127.0.0.1:8000/';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
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

export const UserAPI = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await api.get('/auth/users/');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get single user
  getUser: async (userId) => {
    try {
      const response = await api.get(`/auth/users/${userId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, newRole) => {
    try {
      const response = await api.patch(`/auth/users/${userId}/`, {
        role: newRole
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      await api.delete(`/auth/users/${userId}/`);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

};
