import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteCalendar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedCalendar, setDeletedCalendar] = useState(null);

  const deleteFaqById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/calendar/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Event');
      }

      setDeletedCalendar(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Event deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Event';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteFaqById, loading, error, deletedCalendar };
};

export default useDeleteCalendar;
