import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import {getAllProducts} from '../services/productApi'
import { CartAPI } from "../services/cartApi";
import Stepper from '../components/Stepper';

export default function Order() {
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.log('error loading products ', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      fetchCartItems();
    }
  }, [products]);

  const fetchCartItems = async () => {
    try {
      const data = await CartAPI.getCart();
      const cartItems = data.map(cartItem => {
        const product = products.find(prod => prod.id === cartItem.product);
        return {
          ...product,
          cart_id: cartItem.id,
          quantity: cartItem.quantity,
        };
      });
      setCart(cartItems);
    } catch (err) {
      console.log('Error loading cart items:', err);
    }
  };

  return (
    <>
      <Navbar/>
      <Stepper />
    </>
  );
}
