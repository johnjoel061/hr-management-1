import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteLeaveTypeById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedLeaveType, setDeletedLeaveType] = useState(null);

  const deleteLeaveTypeById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/leave-type/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete leave type');
      }

      setDeletedLeaveType(response.data.data); 
      message.success('Leave type deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete leave type';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteLeaveTypeById, loading, error, deletedLeaveType };
};

export default useDeleteLeaveTypeById;
