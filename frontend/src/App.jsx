import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ClientPrivateRoute, AdminPrivateRoute } from './PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home'; // Protected page
import Register from './pages/Register';
import Order from './pages/Order';
import Products from './pages/Products';
import Dashbord from './admin/pages/Dashbord'

function App() {
  return (
    <Router>
      <AuthProvider>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/orders"
            element={
              <ClientPrivateRoute>
                <Order />
              </ClientPrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ClientPrivateRoute>
                <Products />
              </ClientPrivateRoute>
            }
          />

          <Route
            path="/dashbord"
            element={
              <AdminPrivateRoute>
                <Dashbord />
              </AdminPrivateRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
