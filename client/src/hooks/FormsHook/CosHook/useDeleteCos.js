import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteCosById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedCos, setDeletedCos] = useState(null);

  const deleteCosById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/contract-of-service/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete COS');
      }

      setDeletedCos(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('COS deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete COS';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedCos, loading, error, deleteCosById };
};

export default useDeleteCosById;
