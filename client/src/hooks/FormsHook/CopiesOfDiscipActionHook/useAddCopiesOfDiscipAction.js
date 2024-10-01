import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddCopiesOfDiscipActionHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCopiesOfDiscipAction = async (CopiesOfDiscipActionData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(CopiesOfDiscipActionData).forEach((key) => {
        if (key === 'copScannedPicture' && CopiesOfDiscipActionData[key]) {
          Array.from(CopiesOfDiscipActionData[key]).forEach((file, index) => {
            formData.append('copScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, CopiesOfDiscipActionData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/copies-of-disciplinary-actions/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Copies of Disciplinary Action added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.appointment;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Copies of Disciplinary Action');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Copies of Disciplinary Action error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addCopiesOfDiscipAction, loading, error };
};

export default useAddCopiesOfDiscipActionHook;
