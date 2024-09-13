import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteDesignationById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedDesignation, setDeletedDesignation] = useState(null);

  const deleteDesignationById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/designation/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Designation');
      }

      setDeletedDesignation(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Designation deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Designation';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedDesignation, loading, error, deleteDesignationById };
};

export default useDeleteDesignationById;
