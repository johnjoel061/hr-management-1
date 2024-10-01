import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteCommendationAndAwardById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedCommendationAndAward, setDeletedCommendationAndAward] = useState(null);

  const deletedCommendationAndAwardById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/commendations-and-awards/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Commendation and Award');
      }

      setDeletedCommendationAndAward(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Commendation and Award deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Commendation and Award';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedCommendationAndAward, loading, error, deletedCommendationAndAwardById };
};

export default useDeleteCommendationAndAwardById;
