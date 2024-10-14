import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductFormModal = ({ isOpen, onClose, onSuccess, initialData = null, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    category_id: '',
    count_in_stock: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        image: null, // Reset image to null as we can't pre-fill file inputs
      });
    } else {
      // Reset form when adding a new product
      setFormData({
        name: '',
        price: '',
        description: '',
        image: null,
        category_id: '',
        count_in_stock: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files.length > 0) {
      setFormData(prevData => ({ ...prevData, [name]: files[0] }));
    } else if (['price', 'count_in_stock'].includes(name)) {
      setFormData(prevData => ({ ...prevData, [name]: parseFloat(value) }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'image') {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }
  
    try {
      await onSuccess(formDataToSend);
      onClose();
    } catch (err) {
      console.error(err.response?.data);
      setError('Failed to save product. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-5 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category_id" className="block mb-2 text-sm font-medium text-gray-700">Product Category</label>
            <select 
              id="category_id" 
              name="category_id"
              value={formData.category_id} 
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Product Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="count_in_stock" className="block mb-2 text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="count_in_stock"
              name="count_in_stock"
              value={formData.count_in_stock}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
              accept="image/*"
            />
          </div>
          <div className="flex items-center justify-end p-6 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={loading}
            >
              {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;