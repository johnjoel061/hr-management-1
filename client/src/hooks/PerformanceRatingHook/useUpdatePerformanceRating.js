import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdatePerformanceRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePerformanceRating = async (userId, prId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://hr-management-1-baxp.onrender.com/api/employee/performance-rating/${userId}/${prId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Performance Rating entry updated successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to update Performance Rating entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Update Performance Rating error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { updatePerformanceRating, loading, error };
};

export default useUpdatePerformanceRating;
