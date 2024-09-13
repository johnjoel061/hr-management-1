import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteCopiesOfDiscipActionById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedCopiesOfDiscipAction, setDeletedCopiesOfDiscipAction] = useState(null);

  const deleteCopiesOfDiscipActionById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/copies-of-disciplinary-actions/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Copies of Disciplinary Action');
      }

      setDeletedCopiesOfDiscipAction(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Copies of Disciplinary Action deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Copies of Disciplinary Action';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedCopiesOfDiscipAction, loading, error, deleteCopiesOfDiscipActionById };
};

export default useDeleteCopiesOfDiscipActionById;
