import axios from 'axios';

const API_URL = 'http://localhost:8000/api/products'
// fetch all products

const API_BASE_URL = 'http://localhost:8000/api/products';

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

export const getCategories = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/products/categories/');
        return response.data
    }catch(err){
        console.log("Error fecthing category ", err)
        throw err
    }
}

export const getAllCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};



export const addCategory = async (categoryData) => {
    try {
      const response = await api.post('/categories/', categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };
  
  export const updateCategory = async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}/`, categoryData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };
  
  export const deleteCategory = async (id) => {
    try {
      const response = await api.delete(`/categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };