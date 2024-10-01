import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteLearningDevelopment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLearningDevelopment = async (userId, ldId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/employee/learning-development/${userId}/${ldId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success('Learning development entry deleted successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to delete learning development entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error deleting learning development');
    } finally {
      setLoading(false);
    }
  };

  return { deleteLearningDevelopment, loading, error };
};

export default useDeleteLearningDevelopment;
