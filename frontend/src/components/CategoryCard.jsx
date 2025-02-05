import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // If no products, don't render
  if (category.products.length === 0) return null;

  // Show only up to 3 product images
  const imageCount = Math.min(category.products.length, 3);

  // Grid areas for up to 3 images
  // We'll define separate areas for 1, 2, or 3 images.
  // “a” “b” “c” are assigned to each image in the array
  const gridTemplateAreasByCount = {
    1: '"a"',
    2: '"a b"',
    3: '"a b" "c c"'
  };
  const gridTemplateAreas = gridTemplateAreasByCount[imageCount];

  // Calculate grid columns & rows
  // For 2 images => 1fr 1fr, for 3 images => first row 2 columns, second row 2 columns
  const gridTemplateColumns = imageCount > 1 ? '1fr 1fr' : '1fr';
  // For 3 images => 2 rows of 120px each, else 1 row
  const gridTemplateRows = imageCount === 3 ? '120px 120px' : '200px';

  return (
    <Link
      to="/products"
      state={{ categoryId: category.id, categoryName: category.name }}
      className="block bg-gray-50 text-black rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="p-4">
        {/* Smaller title (text-xl), less spacing */}
        <h2 className="text-xl font-bold mb-2">{category.name}</h2>

        <div
          className="grid gap-2"
          style={{
            gridTemplateAreas,
            gridTemplateColumns,
            gridTemplateRows
          }}
        >
          {category.products.slice(0, 3).map((product, index) => (
            <img
              key={product.id}
              className="w-full h-full object-cover rounded-md shadow-sm transform transition-transform duration-300 hover:scale-105"
              src={product.images[0].image}
              alt={`${product.name}`}
              // “abcd” is a short string. For 3 images, we only use 'abc' indices
              style={{ gridArea: 'abc'[index] }}
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

// CategoryCards: only display the last 3 categories
const CategoryCards = ({ categories }) => {
  // Slice the array to get the last 3 categories
  const displayedCategories = categories.slice(-3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryCards;
