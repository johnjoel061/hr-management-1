import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateFaq = () => {
  const [loading, setLoading] = useState(false);
  
  const updateFaqById = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/faqs/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Faq updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Faq';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateFaqById, loading };
};

export default useUpdateFaq;
