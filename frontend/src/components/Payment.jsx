import { useEffect, useState } from "react";
import {CartAPI} from '../services/cartApi'
import {getAllProducts} from '../services/productApi'
import {Link} from 'react-router-dom'
export default function Payment() {

  const [products,setProducts] = useState([])
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () =>{
      try {
        const data = await getAllProducts();
        setProducts(data)
      }catch(err){
        console.log('error loading products ',err)
      }
    };
  
    fetchProducts();

  },[])

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
          cart_id : cartItem.id,
          quantity: cartItem.quantity,
        };
      });
      setCart(cartItems);
      console.log("cart details:", cartItems);
    } catch (err) {
      console.log('Error loading cart items:', err);
    }
  };


  const deleteItem = async (cartId) => {
    try{
      await CartAPI.removeItem(cartId)
      console.log('item deleted')
      fetchCartItems()
    }catch(err){
      console.log('error while deleting item from cart',err)
    }
  }

  const updateItemQuantity = async(cartId,newQuantity) => {
    try{
      await CartAPI.updateItemQuantity(cartId,newQuantity)
      // fetchCartItems()
      setCart((prevItems) =>
        prevItems.map((item) =>
          item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
        )
      );
      console.log(cart)
      console.log('item quantity updated')
    }catch(err){
      console('error while upating carte quantity',err)
    }
  }

  const increaseQuantity = async (cartId, quantity, count_in_stock) => {
    if (quantity < count_in_stock) {
      const newQuantity = quantity + 1;
      await updateItemQuantity(cartId, newQuantity);
    } else {
      console.log("Quantity can't exceed stock limit");
    }
  };
  
  const decreaseQuantity = async (cartId, quantity) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      await updateItemQuantity(cartId, newQuantity);
    } else {
      console.log("Quantity can't be less than 1");
    }
  };
  
  // Calculate the total price dynamically
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  return (
      <div>
        {cart.map((item) => (
          <div key={item.id} className="border rounded-lg p-3 mb-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-lg font-semibold truncate">{item.name}</h5>
                <p className="text-sm text-gray-600 truncate">{item.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => decreaseQuantity(item.cart_id,item.quantity)} className="text-gray-500 hover:text-gray-700">-</button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.cart_id,item.quantity,item.count_in_stock)} className="text-gray-500 hover:text-gray-700">+</button>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {item.price} MRO
                  </span>
                </div>
              </div>
              <button onClick={() => deleteItem(item.cart_id)} className="text-red-500 hover:text-red-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Subtotal */}
        <div className="flex justify-between items-center border-t pt-4 mb-4">
          <h5 className="text-lg font-semibold">Subtotal</h5>
          <span className="text-xl font-bold text-red-600">{calculateTotalPrice()} MRO</span>
        </div>


      </div>

);
}
