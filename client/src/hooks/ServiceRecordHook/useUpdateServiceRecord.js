import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateServiceRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateServiceRecord = async (userId, srId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://hr-management-1-baxp.onrender.com/api/employee/service-record/${userId}/${srId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Service Record entry updated successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to update Service Record entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error updating Service Record');
    } finally {
      setLoading(false);
    }
  };

  return { updateServiceRecord, loading, error };
};

export default useUpdateServiceRecord;
