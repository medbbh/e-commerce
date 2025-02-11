// MobileCategoryCards.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MobileCategoryCards = ({ categories }) => {
  // For demonstration, use the last three categories.
  // You can adjust this to show all or a different slice.
  const displayedCategories = categories.slice(-3);

  return (
    <div className="md:hidden px-4 mt-8 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Browse Categories</h2>
      <div className="space-y-4">
        {displayedCategories.map((category) => (
          <Link
            key={category.id}
            to="/products"
            state={{ categoryId: category.id, categoryName: category.name }}
            className="group relative block rounded-lg overflow-hidden shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            {category.products && category.products.length > 0 && (
              <img
                src={category.products[0].images[0].image}
                alt={category.name}
                className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-colors duration-300 group-hover:bg-opacity-60">
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryCards;

