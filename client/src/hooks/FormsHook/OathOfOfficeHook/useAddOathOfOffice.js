import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddOathOfOffice = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addOathOfOffice = async (oathOfOfficeData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(oathOfOfficeData).forEach((key) => {
        if (key === 'oatScannedPicture' && oathOfOfficeData[key]) {
          Array.from(oathOfOfficeData[key]).forEach((file, index) => {
            formData.append('oatScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, oathOfOfficeData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('http://localhost:3000/api/oath-of-office/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Oath of Office added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.oathOfOffice;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Oath of Office');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Oath of Office error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addOathOfOffice, loading, error };
};

export default useAddOathOfOffice;
