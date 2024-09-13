import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddPersonalDataSheet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPersonalDataSheet = async (personalDataSheetData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(personalDataSheetData).forEach((key) => {
        if (key === 'pdsScannedPicture' && personalDataSheetData[key]) {
          Array.from(personalDataSheetData[key]).forEach((file, index) => {
            formData.append('pdsScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, personalDataSheetData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('http://localhost:3000/api/personal-data-sheet/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Personal Data Sheet (PDS) added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.personalDataSheet;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Personal Data Sheet (PDS)');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Personal Data Sheet (PDS) error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addPersonalDataSheet, loading, error };
};

export default useAddPersonalDataSheet;
