import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdatePrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  
  const updatePrivacyPolicyById = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/privacy-policy/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Privacy Policy updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Privacy Policy';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updatePrivacyPolicyById, loading };
};

export default useUpdatePrivacyPolicy;
