import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from "../components/ProductCart";
import { getAllProducts } from '../services/productApi';
import { CartAPI } from "../services/cartApi";

import man from '../assets/categories/man.jpg';
import woman from '../assets/categories/woman.jpg';
import kids from '../assets/categories/kids.jpg';
import plants from '../assets/categories/plants.jpg';
import { getCategories } from "../services/categoryApi";
import { Link } from 'react-router-dom';
import CategoryCards from "../components/CategoryCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    { src: man, title: "What men need" },
    { src: woman, title: "Women's fashion" },
    { src: kids, title: "Kids' collection" },
    { src: plants, title: "Home & garden" }
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

  // Auto-scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer); // Cleanup on component unmount
  }, [nextImage]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        console.log(categories)
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

  const addToCart = async (productId, quantity) => {
    try {
      const cartItems = await CartAPI.getCart();
      const productExists = cartItems.some(item => item.product === productId);
      if (productExists) {
        console.log('product already in cart');
      } else {
        await CartAPI.addItem(productId, quantity);
        fetchCartItems();
        console.log('product added to cart');
      }
    } catch (error) {
      console.log('error while adding item to cart', error);
    }
  };


  const handleCategoryClick = (categoryId) => {
    // Handle the category click here, e.g., navigate to the category page
    console.log(`Clicked category with id: ${categoryId}`);
    // Implement your navigation logic here
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col">
        {/* Carousel Section */}
        <div className="relative h-[50vh] bg-gray-900 overflow-hidden">
          {carouselImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{backgroundImage: `url(${image.src})`}}
            />
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <ChevronLeft onClick={prevImage} className="text-white cursor-pointer z-10" size={40} />
            <ChevronRight onClick={nextImage} className="text-white cursor-pointer z-10" size={40} />
          </div>
          <div className="absolute bottom-0 left-0 p-5 text-white z-10">
            <p className="text-blue-300 font-extralight text-5xl">All-new</p>
            <h1 className="text-7xl">{carouselImages[currentImageIndex].title}</h1>
          </div>
        </div>


      <div className="container mx-auto p-4">
            <CategoryCards categories={categories} />
      </div>

      </div>
    </>
  );
}

export default Home;