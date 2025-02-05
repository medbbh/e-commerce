import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import CartDrawer from "./CartDrawer";
import { getAllProducts } from '../services/productApi';
import { CartAPI } from "../services/cartApi";
import AuthContext from '../context/AuthContext';
import { Home, ShoppingCart, Package, Grid, User, LogOut, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, loginUser, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);
  const [products, setProducts] = useState([]);
  // const [cart, setCart] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });

  const { cart, deleteItem, updateItemQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.log('error loading products ', err);
      }
    };

    fetchProducts();
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);
  
  useEffect(() => {
    if (products.length > 0) {
      fetchCartItems();
    }
  }, [products]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const menuButton = event.target.closest('.menu-button');
      const mobileMenu = event.target.closest('.mobile-menu');
      
      if (mobileMenuOpen && !mobileMenu && !menuButton) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [mobileMenuOpen]);

  const fetchCartItems = async () => {
    try {
      const data = await CartAPI.getCart();
      const cartItems = data.map(cartItem => {
        const product = products.find(prod => prod.id === cartItem.product);
        return {
          ...product,
          cart_id: cartItem.id,
          quantity: cartItem.quantity,
        };
      });
      setCart(cartItems);
    } catch (err) {
      console.log('Error loading cart items:', err);
    }
  };

  // const deleteItem = async (cartId) => {
  //   try {
  //     await CartAPI.removeItem(cartId);
  //     fetchCartItems();
  //   } catch (err) {
  //     console.log('error while deleting item from cart', err);
  //   }
  // };

  // const updateItemQuantity = async (cartId, newQuantity) => {
  //   try {
  //     await CartAPI.updateItemQuantity(cartId, newQuantity);
  //     setCart((prevItems) =>
  //       prevItems.map((item) =>
  //         item.cart_id === cartId ? { ...item, quantity: newQuantity } : item
  //       )
  //     );
  //   } catch (err) {
  //     console.log('error while updating cart quantity', err);
  //   }
  // };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
  };

  const toggleMobileMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (userInfo.password !== userInfo.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Updating profile with:', {
      name: userInfo.name,
      email: userInfo.email,
      password: userInfo.password ? '********' : 'unchanged'
    });
    setShowProfileDialog(false);
    setUserInfo(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  const NavLink = ({ to, onClick, children }) => (
    <Link
      to={to}
      onClick={() => {
        setMobileMenuOpen(false);
        onClick?.();
      }}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
    >
      {children}
    </Link>
  );

  return (
    <>
      <CartDrawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        cartItems={cart}
        
        deleteItem={deleteItem}
        updateItemQuantity={updateItemQuantity}
      />

      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo section */}
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-10 w-auto"
                src="../src/assets/logo.png"
                alt="Your Company"
              />
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavLink to="/"><Home size={16} /><span>Home</span></NavLink>
              <button
                onClick={() => setShowDrawer(true)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <ShoppingCart size={16} /><span>Cart ({cart.length})</span>
              </button>
              <NavLink to="/orders"><Package size={16} /><span>Orders</span></NavLink>
              <NavLink to="/products"><Grid size={16} /><span>Products</span></NavLink>
            </div>

            {/* Profile section */}
            <div className="hidden md:flex md:items-center">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <User size={16} />
                    <span>{user.name || 'Profile'}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          setShowProfileDialog(true);
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        <User size={16} className="mr-2" />
                        Your Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login">
                  <User size={16} />
                  <span>Login</span>
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded={mobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 shadow-lg">
              <NavLink to="/"><Home size={16} /><span>Home</span></NavLink>
              <button
                onClick={() => {
                  setShowDrawer(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <ShoppingCart size={16} /><span>Cart ({cart.length})</span>
              </button>
              <NavLink to="/orders"><Package size={16} /><span>Orders</span></NavLink>
              <NavLink to="/products"><Grid size={16} /><span>Products</span></NavLink>
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setShowProfileDialog(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <User size={16} /><span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  >
                    <LogOut size={16} /><span>Sign out</span>
                  </button>
                </>
              ) : (
                <NavLink to="/login"><User size={16} /><span>Login</span></NavLink>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Dialog */}
      {showProfileDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    id="password"
                    value={userInfo.password}
                    onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileDialog(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}