import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddCalendar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addCalendar = async (calendarData) => {
    setLoading(true);
    try {
      // Make API request to add 
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/calendar/add', calendarData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Event added successfully');
        setLoading(false);
        setError(null); // 
        return response.data.data.event;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add Event');
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add Event error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addCalendar, loading, error };
};

export default useAddCalendar;
