import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddTor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTor = async (torData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(torData).forEach((key) => {
        if (key === 'torScannedPicture' && torData[key]) {
          Array.from(torData[key]).forEach((file, index) => {
            formData.append('torScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, torData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/tor/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('TOR added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.tor;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add TOR');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add TOR error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addTor, loading, error };
};

export default useAddTor;
