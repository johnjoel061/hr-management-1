import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddClearanceMoneyPropertyAcct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addClearanceMoneyPropertyAcct = async (clearanceMoneyPropertyAcctData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(clearanceMoneyPropertyAcctData).forEach((key) => {
        if (key === 'cleScannedPicture' && clearanceMoneyPropertyAcctData[key]) {
          Array.from(clearanceMoneyPropertyAcctData[key]).forEach((file, index) => {
            formData.append('cleScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, clearanceMoneyPropertyAcctData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/clearance-from-money-and-property-accountabilities/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Clearance from Money & Property Accountabilities added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.clearanceMoneyPropertyAcct;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Clearance from Money & Property Accountabilities');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Clearance from Money & Property Accountabilities error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addClearanceMoneyPropertyAcct, loading, error };
};

export default useAddClearanceMoneyPropertyAcct;
