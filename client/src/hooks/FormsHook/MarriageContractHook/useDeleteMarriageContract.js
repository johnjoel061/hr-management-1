import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteMarriageContractById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedMarriageContract, setDeletedMarriageContract] = useState(null);

  const deleteMarriageContractById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/marriage-contract/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Marriage Contract');
      }

      setDeletedMarriageContract(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Marriage Contract deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Marriage Contract';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedMarriageContract, loading, error, deleteMarriageContractById };
};

export default useDeleteMarriageContractById;
