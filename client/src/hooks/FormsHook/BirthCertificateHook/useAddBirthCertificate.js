import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddBirthCertificate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBirthCertificate = async (birthCertificateData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(birthCertificateData).forEach((key) => {
        if (key === 'birScannedPicture' && birthCertificateData[key]) {
          Array.from(birthCertificateData[key]).forEach((file, index) => {
            formData.append('birScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, birthCertificateData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/birth-certificate/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Birth Certificate added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.birthCertificate;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Birth Certificate');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Birth Certificate error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addBirthCertificate, loading, error };
};

export default useAddBirthCertificate;
