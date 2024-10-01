import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedRequestForm, setDeletedRequestForm] = useState(null);

  const deleteRequestForm = async (certificationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/request-form/certification/delete/${certificationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete requested certification');
      }

      setDeletedRequestForm(response.data.requestForm);
      message.success('requested certification deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete requested certification';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedRequestForm, loading, error, deleteRequestForm };
};

export default useDeleteRequestForm;
