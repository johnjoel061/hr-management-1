import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateEligibilityById = () => {
  const [loading, setLoading] = useState(false);
  
  const updateEligibilityById = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/eligibility/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Eligibility updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update eligibility';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateEligibilityById, loading };
};

export default useUpdateEligibilityById;
