import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteServiceRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteServiceRecord = async (userId, srId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3000/api/employee/service-record/${userId}/${srId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success('Service Record entry deleted successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to delete Service Record entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Delete Service Record error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteServiceRecord, loading, error };
};

export default useDeleteServiceRecord;
