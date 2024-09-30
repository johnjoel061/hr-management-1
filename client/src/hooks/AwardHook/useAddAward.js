import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddAward = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addAward = async (userId, awData) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/employee/awards/${userId}/add`, awData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success('Award entry added successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to add Award entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Add Award error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addAward, loading, error };
};

export default useAddAward;