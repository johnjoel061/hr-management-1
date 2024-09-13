import { useState, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUploadSignature = (userId, onSignatureUpdate) => {
  const [loading, setLoading] = useState(false);

  const uploadSignature = useCallback(async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('signature', file);

    try {
      const response = await axios.put(`http://localhost:3000/api/employee/users/${userId}/signature`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('User signature updated successfully');
      // Delay and show warning message
      const warningKey = 'warningMessage';
      setTimeout(() => {
        message.warning({
          content: 'Refresh your browser to use the updated signature for leave application.',
          key: warningKey,
          duration: 12, // Duration in seconds
        });
      }, 2000); 

      onSignatureUpdate(response.data.signature); 
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload user signature';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, onSignatureUpdate]);

  return { uploadSignature, loading };
};

export default useUploadSignature;
