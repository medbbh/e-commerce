import Navbar from "../components/Navbar";
import man from '../assets/categories/man.jpg'
import woman from '../assets/categories/woman.jpg'
import kids from '../assets/categories/kids.jpg'
import plants from '../assets/categories/plants.jpg'
import logo from '../assets/logo.png'
import { useEffect, useState } from "react";
import {getAllProducts} from '../services/productApi'
import ProductCard from "../components/ProductCart";
import { CartAPI } from "../services/cartApi";

const Home = () => {

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
  
  const addToCart = async (productId, quantity) => {
    try {
      const  cartItems = await CartAPI.getCart()
      const productExists = cartItems.some(item => item.product === productId);
      if(productExists){
        console.log('product already in cart')
      }else{
        await CartAPI.addItem(productId, quantity);
        fetchCartItems()

        console.log('product added to cart')
      }
      // fetchCart(); 
    } catch (error) {
      console.log('error while adding item to cart',error)
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
 

  return (
    <>

      <Navbar cartItems={cart} deleteItem={deleteItem} updateItemQuantity={updateItemQuantity}/>


      <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12 min-h-screen px-5">
        <div className="flex justify-between">

          <h1 className="mx-5 text-lg font-medium">Cayegory chosen</h1>
          
          <div className="relative inline-block max-w-xs me-4">
            <select className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
              <option>All categiries</option>
              <option>Category 1</option>
              <option>Category 2</option>
              <option>Category 3</option>
            </select>
          </div>
        </div>

        <div className="container mx-auto px-4 my-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <ProductCard products={products} addToCart={addToCart} />
        </div>
        </div>
      </section>

      <section className="bg-gray-900 text-white p-5 flex justify-around items-center bg-cover bg-center mb-5"  style={{backgroundImage: `url(${man})`}}>
        {/* <img src="./src/assets/logo.png"/> */}
        <div className="bg-cover bg-center">
          <p className="text-blue-300 font-extralight text-5xl">All-new</p>
          <h1 className="text-7xl">What men need</h1>
        </div>

      </section>
    </>
  );
}
export default Home;
