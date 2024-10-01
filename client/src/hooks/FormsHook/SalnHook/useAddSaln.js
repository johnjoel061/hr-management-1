import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddSaln = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addSaln = async (salnData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(salnData).forEach((key) => {
        if (key === 'salScannedPicture' && salnData[key]) {
          Array.from(salnData[key]).forEach((file, index) => {
            formData.append('salScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, salnData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/saln/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('SALN added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.saln;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add SALN');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add SALN error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addSaln, loading, error };
};

export default useAddSaln;
