import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateAward = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateAward = async (userId, awId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/employee/awards/${userId}/${awId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Award entry updated successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to update Award entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Update Award error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { updateAward, loading, error };
};

export default useUpdateAward;
