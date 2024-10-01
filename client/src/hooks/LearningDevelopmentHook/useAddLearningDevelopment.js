import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddLearningDevelopment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLearningDevelopment = async (userId, ldData) => {
    setLoading(true);
    try {
      const response = await axios.post(`https://hr-management-1-baxp.onrender.com/api/employee/learning-development/${userId}/add`, ldData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success('Learning development entry added successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to add learning development entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error adding learning development');
    } finally {
      setLoading(false);
    }
  };

  return { addLearningDevelopment, loading, error };
};

export default useAddLearningDevelopment;
