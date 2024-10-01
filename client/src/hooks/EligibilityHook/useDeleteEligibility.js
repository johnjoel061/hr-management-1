import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteEligibilityById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedEligibility, setDeletedEligibility] = useState(null);

  const deleteEligibilityById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/eligibility/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete eligibility');
      }

      setDeletedEligibility(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Eligibility deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete eligibility';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteEligibilityById, loading, error, deletedEligibility };
};

export default useDeleteEligibilityById;
