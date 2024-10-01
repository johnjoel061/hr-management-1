import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddCos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCos = async (cosData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(cosData).forEach((key) => {
        if (key === 'cosScannedPicture' && cosData[key]) {
          Array.from(cosData[key]).forEach((file, index) => {
            formData.append('cosScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, cosData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/contract-of-service/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('COS added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.cos;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add COS');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add COS error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addCos, loading, error };
};

export default useAddCos;
