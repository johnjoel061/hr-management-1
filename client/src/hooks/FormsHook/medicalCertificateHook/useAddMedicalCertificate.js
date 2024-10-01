import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddMedicalCertificate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMedicalCertificate = async (medicalCertificateData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(medicalCertificateData).forEach((key) => {
        if (key === 'medScannedPicture' && medicalCertificateData[key]) {
          Array.from(medicalCertificateData[key]).forEach((file, index) => {
            formData.append('medScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, medicalCertificateData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/medical-certificate/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Medical Certificate added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.medicalCertificate;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Medical Certificate');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Medical Certificate error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addMedicalCertificate, loading, error };
};

export default useAddMedicalCertificate;
