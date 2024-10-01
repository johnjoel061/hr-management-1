import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateLeaveTypeById = () => {
  const [loading, setLoading] = useState(false);
  
  const updateLeaveTypeById = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/leave-type/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Leave type updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update leave type';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateLeaveTypeById, loading };
};

export default useUpdateLeaveTypeById;
