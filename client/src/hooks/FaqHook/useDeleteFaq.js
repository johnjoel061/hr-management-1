import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteFaq = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedFaq, setDeletedFaq] = useState(null);

  const deleteFaqById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/faqs/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Faq');
      }

      setDeletedFaq(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Faq deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Faq';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteFaqById, loading, error, deletedFaq };
};

export default useDeleteFaq;
