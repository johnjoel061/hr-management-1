import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (email, verificationCode, newPassword) => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/reset-password', {
        email,
        verificationCode,
        newPassword
      });
      message.success(response.data.message);
    } catch (err) {
      message.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
};

export default useResetPassword;

  