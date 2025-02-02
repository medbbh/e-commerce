import React, { useState, useContext, useEffect, useCallback } from 'react';
// import { useToast } from '@/components/ui/use-toast';
import UsersTable from '../components/UsersTable';
import AuthContext from '../../context/AuthContext';
import { UserAPI } from '../../services/userApi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  // const { toast } = useToast();

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UserAPI.getUsers();
      
      // Filter out the current user if they're a regular admin (role 2)
      // Super admins (role 1) can see all users
      const filteredUsers = currentUser.role === 1 
        ? data 
        : data.filter(u => u.id !== currentUser.id);
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);

    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Update user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      // Check if user has permission to update roles
      if (currentUser.role !== 1 && (newRole === 1 || currentUser.role !== 2)) {
        throw new Error("You don't have permission to perform this action");
      }

      await UserAPI.updateUserRole(userId, newRole);
      await fetchUsers(); // Refresh the users list
      
    } catch (error) {
      console.error('Error updating user role:', error);

    }
  };


  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Users Management</h1>
      <UsersTable 
        users={users} 
        onUpdateRole={handleUpdateRole}
        loading={loading}
      />
    </div>
  );
};

export default Users;