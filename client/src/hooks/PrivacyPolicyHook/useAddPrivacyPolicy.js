import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddPrivacyPolicy = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addPrivacyPolicy = async (privacyPolicyData) => {
    setLoading(true);
    try {
      // Make API request to add eligibility
      const response = await axios.post('http://localhost:3000/api/privacy-policy/add', privacyPolicyData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Privacy Policy added successfully');
        setLoading(false);
        setError(null); // 
        return response.data.data.privacyPolicy;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Privacy Policy');
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Privacy Policy error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addPrivacyPolicy, loading, error };
};

export default useAddPrivacyPolicy;
