import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddServiceRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addServiceRecord = async (userId, srData) => {
    setLoading(true);
    try {
      const response = await axios.post(`https://hr-management-1-baxp.onrender.com/api/employee/service-record/${userId}/add`, srData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success('Service Record entry added successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to add Service Record entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error adding Service Record');
    } finally {
      setLoading(false);
    }
  };

  return { addServiceRecord, loading, error };
};

export default useAddServiceRecord;
