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

export const CartAPI = {
  // Fetch the user's shopping cart
  getCart: async () => {
    try {
      const response = await api.get('/carts/');
      return response.data;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Add an item to the cart
  addItem: async (product, quantity = 1) => {
    try {
      const response = await api.post('/carts/', {
        product: product,
        quantity: quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  // Update the quantity of an item in the cart
  updateItemQuantity: async (itemId, newQuantity) => {
    try {
      const response = await api.patch(`/carts/${itemId}/`, {
        quantity: newQuantity
      });
      return response.data;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  },

  // Remove an item from the cart
  removeItem: async (itemId) => {
    try {
      await api.delete(`/carts/${itemId}/`);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
};

// Example usage in a React component:
/*
import React, { useState, useEffect } from 'react';
import { CartAPI } from './CartAPI';

const ShoppingCart = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      const cartData = await CartAPI.getCart();
      setCart(cartData);
    } catch (error) {
      // Handle error (e.g., show error message to user)
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await CartAPI.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      // Handle error
    }
  };

  const handleAddItem = async (productId, quantity) => {
    try {
      await CartAPI.addItem(productId, quantity);
      fetchCart(); // Refresh cart after adding item
    } catch (error) {
      // Handle error
    }
  };

  // ... similar functions for updateItemQuantity and removeItem

  return (
    // Render your shopping cart UI here
  );
};
*/