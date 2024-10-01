import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddAssumptionOfDuty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addAssumptionOfDuty = async (assumptionOfDutyData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(assumptionOfDutyData).forEach((key) => {
        if (key === 'assScannedPicture' && assumptionOfDutyData[key]) {
          Array.from(assumptionOfDutyData[key]).forEach((file, index) => {
            formData.append('assScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {assumptionOfDutyData
          formData.append(key, assumptionOfDutyData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/assumption-of-duty/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Assumption of duty added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.assumptionOfDuty;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Assumption of duty');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Assumption of duty error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addAssumptionOfDuty, loading, error };
};

export default useAddAssumptionOfDuty;
