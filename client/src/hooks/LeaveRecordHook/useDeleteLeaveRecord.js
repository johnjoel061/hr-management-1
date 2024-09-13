import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteLeaveRecord = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLeaveRecord = async (userId, lrId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:3000/api/employee/leave-record/${userId}/${lrId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success('Leave Record entry deleted successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to delete Leave Record entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Delete Leave Record error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteLeaveRecord, loading, error };
};

export default useDeleteLeaveRecord;
