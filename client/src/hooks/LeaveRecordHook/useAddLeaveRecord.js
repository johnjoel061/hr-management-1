import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddLeaveRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLeaveRecord = async (userId, lrData) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/employee/leave-record/${userId}/add`, lrData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success('Leave Record entry added successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to add Leave Record entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Add Leave Record error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addLeaveRecord, loading, error };
};

export default useAddLeaveRecord;