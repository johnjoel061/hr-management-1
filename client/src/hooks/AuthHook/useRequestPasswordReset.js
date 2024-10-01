import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useRequestPasswordReset = () => {
  const [loading, setLoading] = useState(false);

  const requestPasswordReset = async (email) => {
    setLoading(true);

    try {
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/auth/request-password-reset', { email });
      message.success(response.data.message);
    } catch (err) {
      message.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { requestPasswordReset, loading };
};

export default useRequestPasswordReset;
