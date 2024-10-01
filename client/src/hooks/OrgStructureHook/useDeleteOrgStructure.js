import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteOrgStructureById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedOrgStructure, setDeletedOrgStructure] = useState(null);

  const deleteOrgStructureById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/organizational-structure/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Organizational Structure');
      }

      setDeletedOrgStructure(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Organizational Structure deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Organizational Structure';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedOrgStructure, loading, error, deleteOrgStructureById };
};

export default useDeleteOrgStructureById;
