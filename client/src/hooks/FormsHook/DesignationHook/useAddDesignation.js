import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddDesignation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDesignation = async (designationData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(designationData).forEach((key) => {
        if (key === 'desScannedPicture' && designationData[key]) {
          Array.from(designationData[key]).forEach((file, index) => {
            formData.append('desScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, designationData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/designation/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Designation added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.designation;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Designation');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Designation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addDesignation, loading, error };
};

export default useAddDesignation;
