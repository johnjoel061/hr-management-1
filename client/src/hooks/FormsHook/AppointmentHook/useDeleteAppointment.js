import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteAppointmentById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedAppointment, setDeletedAppointment] = useState(null);

  const deleteAppointmentById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/appointment/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete appointment');
      }

      setDeletedAppointment(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Appointment deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete appointment';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedAppointment, loading, error, deleteAppointmentById };
};

export default useDeleteAppointmentById;
