import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedDepartment, setDeletedDepartment] = useState(null);

  const deleteDepartmentById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/department/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete department');
      }

      setDeletedDepartment(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Department deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete department';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteDepartmentById, loading, error, deletedDepartment };
};

export default useDeleteDepartment;
