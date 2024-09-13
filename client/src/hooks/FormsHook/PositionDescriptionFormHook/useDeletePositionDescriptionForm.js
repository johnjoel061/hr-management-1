import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeletePositionDescriptionFormById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedPositionDescriptionForm, setDeletedPositionDescriptionForm] = useState(null);

  const deletePositionDescriptionFormById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/position-description-form/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Position Description Form');
      }

      setDeletedPositionDescriptionForm(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Position Description Form deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Position Description Form';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedPositionDescriptionForm, loading, error, deletePositionDescriptionFormById };
};

export default useDeletePositionDescriptionFormById;
