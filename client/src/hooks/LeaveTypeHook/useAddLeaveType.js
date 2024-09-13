import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddLeaveType = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addLeaveType = async (leaveTypeData) => {
    setLoading(true);
    try {
      // Make API request to add leaveType
      const response = await axios.post('http://localhost:3000/api/leave-type/add', leaveTypeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Leave Type added successfully');
        setLoading(false);
        setError(null); 
        return response.data.data.leaveType; 
      } else {
        setError('Failed to add leave type');
      }
      
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); 
      } else {
        setError('An error occurred. Please try again.'); 
      }
      message.error('Add leave type error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addLeaveType, loading, error };
};

export default useAddLeaveType;
