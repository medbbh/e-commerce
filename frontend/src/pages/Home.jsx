import React, { useEffect, useState, useCallback } from "react";
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Tag, Truck, Mail } from 'lucide-react';
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCart";
import CategoryCards from "../components/CategoryCard";
import { getAllProducts, getTrendingProducts, getFeaturedProducts } from '../services/productApi';
import { CartAPI } from "../services/cartApi";
import { getCategories } from "../services/categoryApi";
import { useCart } from "../context/CartContext";
import Spinner from "../components/Spinner";
import MobileCategoryCards from "../components/MobileCategoryCards";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const { addToCart } = useCart(); // Get addToCart function from context

  const carouselImages = [
    { src: "../src/assets/categories/man.jpg", title: "What men need" },
    { src: "../src/assets/categories/woman.jpg", title: "Women's fashion" },
    { src: "../src/assets/categories/kids.jpg", title: "Kids' collection" },
    { src: "../src/assets/categories/plants.jpg", title: "Home & garden" }
  ];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % carouselImages.length
    );
  }, [carouselImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + carouselImages.length) % carouselImages.length
    );
  }, [carouselImages.length]);

  useEffect(() => {
    const timer = setInterval(nextImage, 5000);
    return () => clearInterval(timer);
  }, [nextImage]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData, trendingData, featuredData] = await Promise.all([
          getAllProducts(),
          getCategories(),
          getTrendingProducts(),
          getFeaturedProducts()
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setTrendingProducts(trendingData);
        setFeaturedProducts(featuredData);
        await fetchCartItems(productsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCartItems = async (productsData) => {
    try {
      const data = await CartAPI.getCart();
      const cartItems = data.map(cartItem => {
        const product = productsData.find(prod => prod.id === cartItem.product);
        return {
          ...product,
          cart_id: cartItem.id,
          quantity: cartItem.quantity,
        };
      });
      setCart(cartItems);
    } catch (err) {
      console.error('Error loading cart items:', err);
    }
  };

  // const addToCart = async (productId, quantity) => {
  //   try {
  //     const cartItems = await CartAPI.getCart();
  //     const productExists = cartItems.some(item => item.product === productId);
  //     if (productExists) {
  //       showAlert('Product is already in your cart.', 'info');
  //     } else {
  //       await CartAPI.addItem(productId, quantity);
  //       fetchCartItems(products);
  //       showAlert('Product added to cart successfully!', 'success');
  //     }
  //   } catch (error) {
  //     console.error('Error while adding item to cart', error);
  //     showAlert('Failed to add product to cart. Please try again.', 'error');
  //   }
  // };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Implement newsletter subscription logic here
    showAlert('Thank you for subscribing to our newsletter!', 'success');
    setEmail('');
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  if (loading) return (
    <Spinner/>
  );
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {alert.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg ${
          alert.type === 'error' ? 'bg-red-100 text-red-700' :
          alert.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {alert.message}
        </div>
      )}

      {/* Carousel Section */}
      <div className="relative h-[100vh] bg-gray-900 overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image.src})` }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center justify-between p-4">
          <ChevronLeft onClick={prevImage} className="text-white hidden md:block cursor-pointer z-10 hover:bg-black hover:bg-opacity-20 rounded-full p-2 transition duration-300" size={40} />
          <ChevronRight onClick={nextImage} className="text-white hidden md:block cursor-pointer z-10 hover:bg-black hover:bg-opacity-20 rounded-full p-2 transition duration-300" size={40} />
        </div>


        <div className="relative mt-20 mb-16 w-full">
          <div className="container mx-auto px-4 hidden md:block">
            <h2 className="text-5xl font-bold mb-8 text-gray-50 text-center">Shop by Category</h2>
            <CategoryCards categories={categories} />
          </div>
                        {/* Mobile Category Section: Visible on mobile */}
      <MobileCategoryCards categories={categories} />
        </div>

      </div>


      {/* Trending Products Section */}
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Trending Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard 
            products={trendingProducts} 
            addToCart={addToCart}
          />
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="bg-gray-900 py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl text-white font-bold mb-6">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductCard 
              key={featuredProducts.id} 
              products={featuredProducts} 
              addToCart={addToCart}
            />
          </div>
        </div>
      </div>

      {/* Special Offers Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-center">
              <Tag className="text-blue-500 mr-4" size={24} />
              <span className="text-gray-800">Up to 50% off on Every holiday</span>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow-md flex items-center">
              <Truck className="text-green-500 mr-4" size={24} />
              <span className="text-gray-800">Free shipping on orders over 500MRU</span>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md flex items-center">
              <Star className="text-yellow-500 mr-4" size={24} />
              <span className="text-gray-800">New arrivals every week</span>
            </div>
            <div className="bg-red-50 p-6 rounded-lg shadow-md flex items-center">
              <TrendingUp className="text-red-500 mr-4" size={24} />
              <span className="text-gray-800">Trending products</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p>We are dedicated to providing the best shopping experience for our customers.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul>
                <li><Link to="/products" className="hover:text-blue-400">Products</Link></li>
                <li><Link to="/about" className="hover:text-blue-400">About</Link></li>
                <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-400"><i className="fab fa-facebook"></i></a>
                <a href="#" className="hover:text-blue-400"><i className="fab fa-twitter"></i></a>
                <a href="#" className="hover:text-blue-400"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2024 esm lboutig. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default Home;
