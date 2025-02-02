import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Users, BarChart2, Settings, Menu, X, LayoutGrid } from 'lucide-react';

const AdminLayout = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: Home, text: 'Dashboard', path: '/admin/dashboard' },
    { icon: ShoppingBag, text: 'Products', path: '/admin/products' },
    { icon: LayoutGrid , text: 'Categories', path: '/admin/categories' },
    { icon: BarChart2, text: 'Orders', path: '/admin/orders' },
    { icon: Users, text: 'Users', path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen">
      <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-20'} flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="flex items-center justify-between p-4">
          <h2 className={`font-bold text-xl ${isOpen ? 'block' : 'hidden'}`}>Admin</h2>
          <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 mt-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path} 
                  className={`flex items-center p-4 hover:bg-gray-700 rounded-md transition-colors duration-200 ${location.pathname === item.path ? 'bg-gray-700' : ''}`}
                >
                  <item.icon size={24} className="mr-4" />
                  <span className={isOpen ? 'block' : 'hidden'}>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-grow bg-gray-100 p-8 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;