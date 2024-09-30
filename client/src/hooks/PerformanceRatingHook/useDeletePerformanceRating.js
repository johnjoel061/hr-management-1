import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeletePerformanceRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePerformanceRating = async (userId, prId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3000/api/employee/performance-rating/${userId}/${prId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success('Performance Rating entry deleted successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to delete Performance Rating entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error deleting Performance Rating');
    } finally {
      setLoading(false);
    }
  };

  return { deletePerformanceRating, loading, error };
};

export default useDeletePerformanceRating;
