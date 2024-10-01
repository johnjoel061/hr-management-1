import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddMarriageContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMarriageContract = async (marriageContractData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(marriageContractData).forEach((key) => {
        if (key === 'marScannedPicture' && marriageContractData[key]) {
          Array.from(marriageContractData[key]).forEach((file, index) => {
            formData.append('marScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, marriageContractData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/marriage-contract/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Marriage Contract added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.marriageContract;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Marriage Contract');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Marriage Contract error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addMarriageContract, loading, error };
};

export default useAddMarriageContract;
