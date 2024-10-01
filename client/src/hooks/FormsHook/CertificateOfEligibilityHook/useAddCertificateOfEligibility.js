import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddCertificateOfEligibility = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCertificateOfEligibility = async (certificateOfEligibilityData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(certificateOfEligibilityData).forEach((key) => {
        if (key === 'cerScannedPicture' && certificateOfEligibilityData[key]) {
          Array.from(certificateOfEligibilityData[key]).forEach((file, index) => {
            formData.append('cerScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, certificateOfEligibilityData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/certificate-of-eligibility/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Certificate of Eligibility added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.certificateOfEligibility;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Certificate of Eligibility');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Certificate of Eligibility error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addCertificateOfEligibility, loading, error };
};

export default useAddCertificateOfEligibility;
