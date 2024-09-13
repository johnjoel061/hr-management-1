import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddRequestForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRequestForm = async (requestFormData) => {
    setLoading(true);
    try {
      // Make API request to add employment certification
      const response = await axios.post('http://localhost:3000/api/request-form/certification/add', requestFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Request certification submitted successfully');
        setLoading(false);
        setError(null);
        return response.data.employmentCertification;
      } else {
        setError('Failed to submit request certification');
      }
      
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already pending')) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
      message.error(error.response.data.message || 'Error submitting request certification');
      message.error('Add request certification error:', error);
      
    } finally {
      setLoading(false);
    }
  };

  return { addRequestForm, loading, error };
};

export default useAddRequestForm;
