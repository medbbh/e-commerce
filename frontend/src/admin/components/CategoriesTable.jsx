import React, { useState } from 'react';
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import CategoryFormModal from './CategoryFormModal';

const CategoriesTable = ({ categories, onAddCategory, onUpdateCategory, onDeleteCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current categories for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        // Handle edit
        await onUpdateCategory(editingCategory.id, formData);
      } else {
        // Handle add
        await onAddCategory(formData);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error submitting category:', error);
      // Optionally, show an error message to the user
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await onDeleteCategory(categoryId);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold leading-tight">Categories</h2>
          <div className="my-2 flex sm:flex-row flex-col">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input 
                type="search" 
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Search category name" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required 
              />
            </div>
            <div className='text-4xl text-white bg-green-500 rounded-full mx-3 px-3'>
              <button onClick={openAddModal}>+</button>
            </div>
          </div>
        </div>
        
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{category.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => openEditModal(category)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredCategories.length)} of {filteredCategories.length} Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={indexOfLastItem >= filteredCategories.length}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={handleFormSubmit}
        initialData={editingCategory}
      />
    </div>
  );
};

export default CategoriesTable;
