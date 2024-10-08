import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddCertOfLeaveBalance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCertOfLeaveBalance = async (certOfLeaveBalanceData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(certOfLeaveBalanceData).forEach((key) => {
        if (key === 'cerScannedPicture' && certOfLeaveBalanceData[key]) {
          Array.from(certOfLeaveBalanceData[key]).forEach((file, index) => {
            formData.append('cerScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, certOfLeaveBalanceData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/certificate-of-leave-balance/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Certificate of Leave Balances added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.appointment;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Certificate of Leave Balances');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Certificate of Leave Balances error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addCertOfLeaveBalance, loading, error };
};

export default useAddCertOfLeaveBalance;
