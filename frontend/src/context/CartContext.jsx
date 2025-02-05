import { createContext, useContext, useState, useEffect } from "react";
import { CartAPI } from "../services/cartApi";
import { getAllProducts } from "../services/productApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  // Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      const products = await getAllProducts(); // Get all products
      const data = await CartAPI.getCart(); // Get cart items
      const cartItems = data.map(cartItem => {
        const product = products.find(prod => prod.id === cartItem.product);
        return { ...product, cart_id: cartItem.id, quantity: cartItem.quantity };
      });
      setCart(cartItems);
    } catch (err) {
      console.log("Error loading cart:", err);
    }
  };

  // Add to Cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const productExists = cart.some(item => item.id === productId);
      if (productExists) {
        showAlert("Product is already in your cart.", "info");
      } else {
        await CartAPI.addItem(productId, quantity);
        fetchCartItems();
        showAlert("Product added to cart successfully!", "success");
      }
    } catch (err) {
      console.log("Error adding to cart:", err);
      showAlert("Failed to add product to cart.", "error");
    }
  };
  
  // Delete Item
  const deleteItem = async (cartId) => {
    try {
      await CartAPI.removeItem(cartId);
      fetchCartItems();
      showAlert("Product removed from cart.", "warning");
    } catch (err) {
      console.log("Error deleting cart item:", err);
      showAlert("Failed to remove product.", "error");
    }
  };
  
  // Update Item Quantity
  const updateItemQuantity = async (cartId, newQuantity) => {
    try {
      await CartAPI.updateItemQuantity(cartId, newQuantity);
      setCart(prevItems =>
        prevItems.map(item =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      showAlert("Cart updated successfully!", "success");
    } catch (err) {
      console.log("Error updating quantity:", err);
      showAlert("Failed to update quantity.", "error");
    }
  };
  

  useEffect(() => {
    fetchCartItems(); // Load cart when component mounts
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, deleteItem, updateItemQuantity,alert,showAlert }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = () => useContext(CartContext);
