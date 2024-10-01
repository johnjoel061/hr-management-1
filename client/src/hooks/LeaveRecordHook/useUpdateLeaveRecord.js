import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateLeaveRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLeaveRecord = async (userId, lrId, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `https://hr-management-1-baxp.onrender.com/api/employee/leave-record/${userId}/${lrId}`,
        updatedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        message.success('Leave Record entry updated successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to update Leave Record entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error updating Leave Record');
    } finally {
      setLoading(false);
    }
  };

  return { updateLeaveRecord, loading, error };
};

export default useUpdateLeaveRecord;
