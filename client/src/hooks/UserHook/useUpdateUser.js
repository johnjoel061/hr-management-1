import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);

  const updateUser = async (id, updates) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/employee/users/${id}`, updates, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      message.success('User updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading };
};

export default useUpdateUser;
