import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeletePersonalDataSheetById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedPersonalDataSheet, setDeletedPersonalDataSheet] = useState(null);

  const deletePersonalDataSheetById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/personal-data-sheet/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Personal Data Sheet (PDS)');
      }

      setDeletedPersonalDataSheet(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Personal Data Sheet (PDS) deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Personal Data Sheet (PDS)';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedPersonalDataSheet, loading, error, deletePersonalDataSheetById };
};

export default useDeletePersonalDataSheetById;
