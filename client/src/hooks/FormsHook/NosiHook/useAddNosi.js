import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddNosi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addNosi = async (nosiData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(nosiData).forEach((key) => {
        if (key === 'nosScannedPicture' && nosiData[key]) {
          Array.from(nosiData[key]).forEach((file, index) => {
            formData.append('nosScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, nosiData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/nosi/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('NOSI/NOSA added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.nosi;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add NOSI/NOSA');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add NOSI/NOSA error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addNosi, loading, error };
};

export default useAddNosi;
