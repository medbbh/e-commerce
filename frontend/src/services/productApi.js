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
      config.headers['Authorization'] = `Bearer ${token.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProducts = async (categoryId = null) => {
  try {
    const url = categoryId 
      ? `${API_BASE_URL}/products/?category_id=${categoryId}`
      : `${API_BASE_URL}/products/`;
    // Consider using the 'api' instance here instead of axios
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await api.post('/products/', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}/`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};