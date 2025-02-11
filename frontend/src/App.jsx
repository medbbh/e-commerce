import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientPrivateRoute, AdminPrivateRoute } from './PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import Order from './pages/Order';
import Products from './pages/Products';
import AdminLayout from './admin/components/Sidebar'; // Import the new AdminLayout
import Dashboard from './admin/pages/Dashboard';
import AdminProducts from './admin/pages/Products';
import AdminCategories from './admin/pages/Categories';
import Orders from './admin/pages/Orders';
import Users from './admin/pages/Users';
import ProductDetail from './components/ProductDetail';
import PassOrder from './pages/PassOrder'
import { MantineProvider } from '@mantine/core';
import { CartProvider } from './context/CartContext';
import AlertComponent from './components/Alert';
import CheckoutFlow from './components/Stepper';


function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>

    <Router>
      <AuthProvider>
        <CartProvider>
        <AlertComponent />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* customer side */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />

          
          <Route
            path="/orders"
            element={
              <ClientPrivateRoute>
                <Order />
              </ClientPrivateRoute>
            }
          />
          <Route
            path="/pass-orders"
            element={
              <ClientPrivateRoute>
                <PassOrder />
              </ClientPrivateRoute>
            }
          />
          <Route path="/checkout" element={<CheckoutFlow />} />



          {/* admin side */}
          <Route
            path="/admin"
            element={
              <AdminPrivateRoute>
                <AdminLayout />
              </AdminPrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>

    </MantineProvider>

  );
}

export default App;