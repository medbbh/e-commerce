import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  if (category.products.length === 0) return null;

  const imageCount = Math.min(category.products.length, 4);
  const gridTemplateAreas = [
    '"a"',
    '"a b"',
    '"a b" "c c"',
    '"a b" "c d"'
  ][imageCount - 1];

  return (
    <Link 
      to="/products"
      state={{ categoryId: category.id, categoryName: category.name }}
      className="block bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden text-white"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">{category.name}</h2>
        <div 
          className="grid gap-3"
          style={{
            gridTemplateAreas,
            gridTemplateColumns: imageCount > 1 ? '1fr 1fr' : '1fr',
            gridTemplateRows: imageCount > 2 ? '120px 120px' : '200px',
          }}
        >
          {category.products.slice(0, 4).map((product, index) => (
            <img
              key={product.id}
              className="w-full h-full object-cover rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105"
              src={product.image}
              alt={`${product.name}`}
              style={{ gridArea: 'abcd'[index] }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

const CategoryCards = ({ categories }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <CategoryCard 
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
};

export default CategoryCards;