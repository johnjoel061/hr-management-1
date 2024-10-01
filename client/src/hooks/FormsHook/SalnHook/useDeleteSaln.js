import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteSalnById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedSaln, setDeletedSaln] = useState(null);

  const deleteSalnById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/saln/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete SALN');
      }

      setDeletedSaln(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('SALN deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete SALN';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedSaln, loading, error, deleteSalnById };
};

export default useDeleteSalnById;
