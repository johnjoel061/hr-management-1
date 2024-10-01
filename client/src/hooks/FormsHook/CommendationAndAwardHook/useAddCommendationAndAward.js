import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddCommendationAndAward = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCommendationAndAward = async (commendationAndAwardData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(commendationAndAwardData).forEach((key) => {
        if (key === 'comScannedPicture' && commendationAndAwardData[key]) {
          Array.from(commendationAndAwardData[key]).forEach((file, index) => {
            formData.append('comScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, commendationAndAwardData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/commendations-and-awards/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Commendation and Award added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.commendationAndAward;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Commendation and Award');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Commendation and Award error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addCommendationAndAward, loading, error };
};

export default useAddCommendationAndAward;
