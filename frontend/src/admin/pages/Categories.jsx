import React, { useEffect, useState } from 'react';
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../../services/categoryApi';
import CategoriesTable from '../components/CategoriesTable';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error while fetching categories:', err);
    }
  };

  const handleAddCategory = async (formData) => {
    try {
      const newCategory = await addCategory(formData);
      setCategories([...categories, newCategory]);
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleUpdateCategory = async (id, formData) => {
    try {
      const updatedCategory = await updateCategory(id, formData);
      setCategories(categories.map(c => c.id === id ? updatedCategory : c));
    } catch (err) {
      console.error('Error updating category:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <CategoriesTable
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
}
