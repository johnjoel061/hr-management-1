import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useApproveRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const approveRequestForm = async (certificationId, file, rejectReason = null) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('certificationId', certificationId);

    if (rejectReason) {
      formData.append('rejectReason', rejectReason);
    } else if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/request-form/certification/approve', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const successMessage = rejectReason 
          ? 'Request certification rejected successfully'
          : 'Request certification approved successfully';
          
        message.success(successMessage);
        setError(null);
        return response.data.requestForm;
      } else {
        setError('Failed to process the request');
      }
    } catch (error) {
      const errorMessage = error.response?.data.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { approveRequestForm, loading, error };
};

export default useApproveRequestForm;
