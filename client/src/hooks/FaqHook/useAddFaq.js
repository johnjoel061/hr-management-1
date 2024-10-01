import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddFaq = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addFaq = async (faqData) => {
    setLoading(true);
    try {
      // Make API request to add eligibility
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/faqs/add', faqData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Faq added successfully');
        setLoading(false);
        setError(null); // 
        return response.data.data.Faq;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Faq');
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Faq error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addFaq, loading, error };
};

export default useAddFaq;
