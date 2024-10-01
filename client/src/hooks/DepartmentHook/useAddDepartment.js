import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDepartment = async (departmentData) => {
    setLoading(true);
    try {
      // Make API request to add eligibility
      const response = await axios.post('https://hr-management-1-baxp.onrender.com/api/department/add', departmentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Department added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.department;  // Return the new eligibility data if needed
      } else {
        // Handle other status codes if necessary
        setError('Failed to add department');
      }
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add department error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addDepartment, loading, error };
};

export default useAddDepartment;
