import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';

const ClientPrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user.role == 3 ? children : <Navigate to="/login" />;
};


const AdminPrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user.role == 2 ? children : <Navigate to="/login" />;
};


export {ClientPrivateRoute,AdminPrivateRoute};
