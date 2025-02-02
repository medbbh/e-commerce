import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ products, addToCart }) => {
  if (!products || products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <>
      {products.map((product) => (
        <ProductCardItem key={product.id} product={product} addToCart={addToCart} />
      ))}
    </>
  );
};

const ProductCardItem = ({ product, addToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
        <img
          className="w-full h-48 object-cover cursor-pointer"
          src={images[currentImageIndex].image}
          alt={`Image of ${product.name}`}
        />
        </Link>
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 transition-colors duration-300 hover:bg-opacity-75"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 transition-colors duration-300 hover:bg-opacity-75"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {product.description}
        </p>
        <div className="flex items-center mb-4">
          <span className="text-yellow-500 mr-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {product.rating}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {product.price} MRO
          </span>
          <button
            onClick={() => addToCart(product.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;