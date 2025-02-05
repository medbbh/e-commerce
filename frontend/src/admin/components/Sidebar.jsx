import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  ShoppingBag,
  Users,
  BarChart2,
  Menu,
  X,
  LayoutGrid,
  LogOut
} from 'lucide-react';

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // For showing a confirmation modal before logout
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Show the confirmation modal
  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Perform actual logout
  const handleLogout = () => {
    // 1) Clear tokens (or do your real logout logic)
    localStorage.removeItem('authTokens');
    // 2) Navigate to login page
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, text: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingBag, text: 'Products', path: '/admin/products' },
    { icon: LayoutGrid, text: 'Categories', path: '/admin/categories' },
    { icon: BarChart2, text: 'Orders', path: '/admin/orders' },
    { icon: Users, text: 'Users', path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${
          isOpen ? 'w-64' : 'w-20'
        } flex flex-col transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className={`font-bold text-xl ${isOpen ? 'block' : 'hidden'}`}>
            Admin
          </h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-2 mt-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center p-4 hover:bg-gray-700 rounded-md transition-colors duration-200 ${
                    location.pathname === item.path ? 'bg-gray-700' : ''
                  }`}
                >
                  <item.icon size={24} className="mr-4" />
                  <span className={isOpen ? 'block' : 'hidden'}>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="p-4 mt-auto">
          <button
            onClick={confirmLogout}
            className="w-full flex items-center p-4 hover:bg-gray-700 rounded-md transition-colors duration-200"
          >
            <LogOut size={24} className="mr-4" />
            <span className={isOpen ? 'block' : 'hidden'}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow bg-gray-100 p-8 overflow-auto relative">
        <Outlet />

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 p-6">
              <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
              <p className="mb-6">Are you sure you want to logout?</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
