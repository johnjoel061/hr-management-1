import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeletePrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedPrivacyPolicy, setDeletedPrivacyPolicy] = useState(null);

  const deletePrivacyPolicyById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/privacy-policy/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Privacy Policy');
      }

      setDeletedPrivacyPolicy(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Privacy Policy deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Privacy Policy';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletePrivacyPolicyById, loading, error, deletedPrivacyPolicy };
};

export default useDeletePrivacyPolicy;
