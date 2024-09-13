import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteAssumptionOfDutyById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedAssumptionOfDuty, setDeletedAssumptionOfDuty] = useState(null);

  const deleteAssumptionOfDutyById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/assumption-of-duty/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete assumption of duty');
      }

      setDeletedAssumptionOfDuty(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Assumption of duty deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete assumption of duty';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedAssumptionOfDuty, loading, error, deleteAssumptionOfDutyById };
};

export default useDeleteAssumptionOfDutyById;
