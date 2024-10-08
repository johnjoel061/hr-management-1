import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateLeaveCredit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLeaveCredit = async (userId, lcId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://hr-management-1-baxp.onrender.com/api/employee/leave-credit/${userId}/${lcId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Leave Credit entry updated successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to update Leave Credit entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error updating Leave Credit');
    } finally {
      setLoading(false);
    }
  };

  return { updateLeaveCredit, loading, error };
};

export default useUpdateLeaveCredit;
