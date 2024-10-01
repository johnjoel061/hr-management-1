import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteLeaveCredit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteLeaveCredit = async (userId, lcId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/employee/leave-credit/${userId}/${lcId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success('Leave Credit entry deleted successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to delete Leave Credit entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error deleting Leave Credit');
    } finally {
      setLoading(false);
    }
  };

  return { deleteLeaveCredit, loading, error };
};

export default useDeleteLeaveCredit;
