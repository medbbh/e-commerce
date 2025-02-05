import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Stepper from '../components/Stepper';
import OrderCard from '../components/OrderCard';

import { getAllProducts } from '../services/productApi';
import { CartAPI } from "../services/cartApi";
import { OrderAPI } from "../services/orderApi";

// ✅ Import the Spinner
import Spinner from "../components/Spinner";

export default function Order() {
  const [isLoading, setIsLoading] = useState(false); // ✅ For showing spinner
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);             // ✅ Missing cart state

  useEffect(() => {
    // ✅ Fetch products & orders in parallel, then fetch cart items if products exist
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products & orders simultaneously
        const [fetchedProducts, fetchedOrders] = await Promise.all([
          getAllProducts(),
          OrderAPI.getOrders(),
        ]);

        setProducts(fetchedProducts);
        setOrders(fetchedOrders);
      } catch (err) {
        console.log('❌ Error loading products or orders:', err);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Once products are loaded, fetch the cart (which depends on product data)
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
      console.log('❌ Error loading cart items:', err);
    }
  };

  // ✅ If still loading, show spinner
  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <OrderCard orders={orders} />
    </>
  );
}
