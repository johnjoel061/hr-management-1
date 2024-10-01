import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddPerformanceRating = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPerformanceRating = async (userId, prData) => {
    setLoading(true);
    try {
      const response = await axios.post(`https://hr-management-1-baxp.onrender.com/api/employee/performance-rating/${userId}/add`, prData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success('Performance Rating entry added successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to add Performance Rating entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error adding Performance Rating');
    } finally {
      setLoading(false);
    }
  };

  return { addPerformanceRating, loading, error };
};

export default useAddPerformanceRating;
