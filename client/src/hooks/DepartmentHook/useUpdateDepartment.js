import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateDepartment = () => {
  const [loading, setLoading] = useState(false);
  
  const updateDepartmentById = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:3000/api/department/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Department updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update department';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateDepartmentById, loading };
};

export default useUpdateDepartment;
