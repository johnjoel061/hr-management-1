import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddLeaveRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLeaveRequest = async (leaveRequestData) => {
    setLoading(true);
    try {
      // Make API request to add leave request
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/add', leaveRequestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Leave request submitted successfully');
        setLoading(false);
        setError(null); 
        return response.data.leaveRequest; 
      } else {
        message.error('Failed to submit leave request');
        setError('Failed to submit leave request');
      }
      
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); 
        message.error('Leave request submitted already');

      // Handle network-related errors (no internet, timeout, etc.)
      } else if (!error.response) {
        setError('Network error. Please check your internet connection.');
        message.error('Failed to submit leave request.');
      
      // Handle other types of server errors
      } else {
        setError('An error occurred. Please try again.');
        message.error('Failed to submit leave request');
      }
      
    } finally {
      setLoading(false);
    }
  };

  return { addLeaveRequest, loading, error };
};

export default useAddLeaveRequest;
