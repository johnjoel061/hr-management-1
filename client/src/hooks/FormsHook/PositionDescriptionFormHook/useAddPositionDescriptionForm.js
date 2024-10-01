import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddPositionDescriptionForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPositionDescriptionForm = async (positionDescriptionFormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(positionDescriptionFormData).forEach((key) => {
        if (key === 'posScannedPicture' && positionDescriptionFormData[key]) {
          Array.from(positionDescriptionFormData[key]).forEach((file, index) => {
            formData.append('posScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, positionDescriptionFormData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/position-description-form/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Position Description Form added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.positionDescriptionForm;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Position Description Form');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Position Description Form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addPositionDescriptionForm, loading, error };
};

export default useAddPositionDescriptionForm;
