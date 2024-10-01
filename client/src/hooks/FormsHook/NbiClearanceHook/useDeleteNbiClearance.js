import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteNbiClearanceById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedNbiClearance, setDeletedNbiClearance] = useState(null);

  const deleteNbiClearanceById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/nbi-clearance/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete NBI Clearance');
      }

      setDeletedNbiClearance(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('NBI Clearance deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete NBI Clearance';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedNbiClearance, loading, error, deleteNbiClearanceById };
};

export default useDeleteNbiClearanceById;
