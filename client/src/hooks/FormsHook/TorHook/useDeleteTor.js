import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteTorById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedTor, setDeletedTor] = useState(null);

  const deleteTorById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/tor/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete TOR');
      }

      setDeletedTor(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('TOR deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete TOR';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedTor, loading, error, deleteTorById };
};

export default useDeleteTorById;
