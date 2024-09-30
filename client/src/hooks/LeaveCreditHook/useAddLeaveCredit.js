import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddLeaveCredit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLeaveCredit = async (userId, lcData) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/employee/leave-credit/${userId}/add`, lcData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        message.success('Leave Credit entry added successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to add Leave Credit entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error adding Leave Credit');
    } finally {
      setLoading(false);
    }
  };

  return { addLeaveCredit, loading, error };
};

export default useAddLeaveCredit;
