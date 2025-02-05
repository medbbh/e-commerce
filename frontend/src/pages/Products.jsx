import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllProducts } from '../services/productApi';
import { getAllCategories } from '../services/categoryApi';
import ProductCard from '../components/ProductCart';
import Spinner from '../components/Spinner'; // ✅ The small spinner we made

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);  // ✅ Overall fetch loading
  const [isAdding, setIsAdding] = useState(false);   // ✅ "Add to cart" loading (Optional)

  // Routing / Category
  const location = useLocation();
  const navigate = useNavigate();
  const { categoryId: initialCategoryId, categoryName: initialCategoryName } = location.state || {};
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || '');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15; // Adjust how many products per page

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.log('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // ✅ Start loading
      try {
        const data = await getAllProducts(selectedCategoryId || null);
        setProducts(data);
        setCurrentPage(1); // Reset page on new category
      } catch (err) {
        console.log('Error loading products:', err);
      }
      setIsLoading(false); // ✅ Done loading
    };
    fetchProducts();
  }, [selectedCategoryId]);

  // Category selector
  const handleCategoryChange = (e) => {
    const newCategoryId = e.target.value;
    setSelectedCategoryId(newCategoryId);
    const selectedCategory = categories.find((cat) => cat.id.toString() === newCategoryId);
    navigate('/products', {
      state: {
        categoryId: newCategoryId,
        categoryName: selectedCategory ? selectedCategory.name : 'All Products',
      },
      replace: true
    });
  };

  // Pagination logic
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // ✅ Add to Cart Loading (Optional) 
  //    If you want to show a spinner on the "Add" button, you can do so in ProductCard 
  //    by passing `isAdding` and `setIsAdding`. Here we just show how you might do it:
  const handleAddToCart = async (productId, quantity = 1) => {
    setIsAdding(true);
    try {
      // call addToCart from context if you want 
      // await addToCart(productId, quantity);
      console.log("Simulate add to cart...");
    } catch (err) {
      console.error(err);
    }
    setIsAdding(false);
  };

  // If overall data is loading, show spinner
  if (isLoading) {
    return (
      <>
        <Navbar />
        <Spinner /> {/* Big spinner while fetching products */}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="bg-gray-50 py-8 min-h-screen px-5">
        <div className="flex justify-between items-center">
          <h1 className="mx-5 text-lg font-medium">
            {initialCategoryName ||
              (selectedCategoryId
                ? categories.find((cat) => cat.id.toString() === selectedCategoryId)?.name
                : 'All Products')}
          </h1>

          <div className="relative inline-block max-w-xs me-4">
            <select
              className="block appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={selectedCategoryId}
              onChange={handleCategoryChange}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="container mx-auto px-4 my-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Show only currentProducts for this page */}
            <ProductCard products={currentProducts} /* Optionally pass isAdding, handleAddToCart */ />
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`mx-1 px-3 py-1 border rounded ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-blue-500'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-1 px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
