import React, { useEffect, useState } from 'react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../services/productApi';
import { getAllCategories } from '../../services/categoryApi';
import ProductsTable from '../components/ProductsTable';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error while fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error while fetching categories:', err);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(selectedCategoryId === categoryId ? null : categoryId);
  };

  const filteredProducts = selectedCategoryId
    ? products.filter(product => product.category_id === selectedCategoryId)
    : products;

  const handleAddProduct = async (formData) => {
    try {
      const newProduct = await addProduct(formData);
      setProducts([...products, newProduct]);
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleUpdateProduct = async (id, formData) => {
    try {
      const updatedProduct = await updateProduct(id, formData);
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      
      <div className="flex space-x-4 overflow-x-auto py-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-4 py-2 rounded-full ${
              selectedCategoryId === category.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-black'
            } transition duration-200 ease-in-out`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <ProductsTable
        products={filteredProducts}
        categories={categories}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}