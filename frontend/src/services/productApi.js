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
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getTrendingProducts = async () => {
  try {
    const response = await api.get('/products/trending/');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/featured/');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const addProduct = async (productData, images) => {
  try {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Append images
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await api.post('/products/', formData, {
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

export const updateProduct = async (id, productData, images) => {
  try {
    const formData = new FormData();
    
    // Append product data
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
    
    // Append images
    images.forEach((image, index) => {
      formData.append('images', image);
    });

    const response = await api.put(`/products/${id}/`, formData, {
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



// review 


export const getRatings = async (productId) => {
  if (!productId) {
    throw new Error("ProductId is required to fetch reviews.");
  }
  try {
    const response = await api.get(`/products/rating/?product_id=${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ratings', error);
    throw error;
  }
};

// Function to create a new rating
export const createRating = async (ratingData) => {
  try {
    const response = await api.post('/products/rating/', ratingData);
    return response.data;
  } catch (error) {
    console.error('Error creating rating', error);
    throw error;
  }
};

// Function to update a rating
// export const updateRating = async (ratingId, ratingData) => {
//   try {
//     const response = await api.patch(`/products/rating/${ratingId}/`, ratingData);
//     return response.data;
//   } catch (error) {
//     console.error('Error updating rating', error);
//     throw error;
//   }
// };

// Function to delete a rating
export const deleteRating = async (ratingId) => {
  try {
    const response = await api.delete(`/products/rating/${ratingId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rating', error);
    throw error;
  }
};