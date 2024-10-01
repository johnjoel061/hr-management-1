import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteUserById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedUser, setDeletedUser] = useState(null);

  const deleteUserById = async (id) => {
    setLoading(true);
    setError(null); 
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/employee/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete user');
      }

      setDeletedUser(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('User deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteUserById, loading, error, deletedUser };
};

export default useDeleteUserById;
