import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateLearningDevelopment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLearningDevelopment = async (userId, ldId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/employee/learning-development/${userId}/${ldId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Learning development entry updated successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to update learning development entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Update learning development error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { updateLearningDevelopment, loading, error };
};

export default useUpdateLearningDevelopment;
