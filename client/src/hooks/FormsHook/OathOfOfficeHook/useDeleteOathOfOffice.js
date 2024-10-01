import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteOathOfOfficeById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedOathOfOffice, setDeletedOathOfOffice] = useState(null);

  const deleteOathOfOfficeById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/oath-of-office/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Oath of Office');
      }

      setDeletedOathOfOffice(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Oath of Office deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Oath of Office';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedOathOfOffice, loading, error, deleteOathOfOfficeById };
};

export default useDeleteOathOfOfficeById;
