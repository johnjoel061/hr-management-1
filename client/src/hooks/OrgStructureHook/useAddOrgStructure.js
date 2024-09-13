import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddOrgStructure = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addOrgStructure = async (orgStructureData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(orgStructureData).forEach((key) => {
        if (key === 'orgScannedPicture' && orgStructureData[key]) {
          Array.from(orgStructureData[key]).forEach((file, index) => {
            formData.append('orgScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, orgStructureData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('http://localhost:3000/api/organizational-structure/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Organizational Structure added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.orgStructure;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Organizational Structure');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Organizational Structure error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addOrgStructure, loading, error };
};

export default useAddOrgStructure;
