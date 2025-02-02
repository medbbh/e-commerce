import React from 'react';
import { X, Package, Star, ShoppingCart, TrendingUp } from 'lucide-react';

const ProductDetailsModal = ({ product, categories, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">Product Details</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className='flex flex-row gap-2 p-2 w-full overflow-x-auto whitespace-nowrap'>
            {
                product.images.map((image) => (
                    <img key={image.id} src={image.image} alt={product.name} className="h-28 w-auto" />
                ))
            }
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Package className="text-gray-500" size={20} />
                <span className="text-lg font-semibold">{product.name}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{product.price} MRU</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${product.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                {product.is_featured ? 'Featured' : 'Standard'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Product Information</h3>
            <div className="space-y-2">
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Category:</strong> {categories.find(category => category.id === product.category_id)?.name || 'Unknown'}</p>
              <p><strong>Count in Stock:</strong> {product.count_in_stock}</p>
              <p className="flex items-center">
                <Star className="text-yellow-400 mr-1" size={16} />
                <strong>Rating:</strong> {product.rating} ({product.num_of_reviews} reviews)
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Sales Information</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <ShoppingCart className="text-blue-500 mr-1" size={16} />
                <strong>Total Sales:</strong> {product.total_sales}
              </p>
              <p className="flex items-center">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <strong>Last Week Sales:</strong> {product.last_week_sales}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
            <p><strong>Created At:</strong> {new Date(product.created_at).toLocaleString()}</p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;