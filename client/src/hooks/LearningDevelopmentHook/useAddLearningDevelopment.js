import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddLearningDevelopment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLearningDevelopment = async (userId, ldData) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/employee/learning-development/${userId}/add`, ldData, {
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
      message.error('Add learning development error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addLearningDevelopment, loading, error };
};

export default useAddLearningDevelopment;