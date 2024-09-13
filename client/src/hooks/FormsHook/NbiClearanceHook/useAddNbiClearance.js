import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddNbiClearance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addNbiClearance = async (nbiData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(nbiData).forEach((key) => {
        if (key === 'nbiScannedPicture' && nbiData[key]) {
          Array.from(nbiData[key]).forEach((file, index) => {
            formData.append('nbiScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, nbiData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('http://localhost:3000/api/nbi-clearance/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('NBI Clearance added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.nbiClearance;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add NBI Clearance');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add NBI Clearance error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addNbiClearance, loading, error };
};

export default useAddNbiClearance;
