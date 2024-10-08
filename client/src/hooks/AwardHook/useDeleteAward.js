import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteAward = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteAward = async (userId, awId) => {
    setLoading(true);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/employee/awards/${userId}/${awId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success('Award entry deleted successfully');
        setLoading(false);
        setError(null);
        return response.data.data;
      } else {
        setError('Failed to delete Award entry');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error('Delete Award error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { deleteAward, loading, error };
};

export default useDeleteAward;
