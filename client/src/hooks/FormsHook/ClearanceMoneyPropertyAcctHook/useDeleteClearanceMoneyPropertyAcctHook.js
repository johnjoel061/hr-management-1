import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteClearanceMoneyPropertyAcctById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedClearanceMoneyPropertyAcct, setDeletedClearanceMoneyPropertyAcct] = useState(null);

  const deleteClearanceMoneyPropertyAcctById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/clearance-from-money-and-property-accountabilities/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Clearance from Money & Property Accountabilities');
      }

      setDeletedClearanceMoneyPropertyAcct(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Clearance from Money & Property Accountabilities deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Clearance from Money & Property Accountabilities';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedClearanceMoneyPropertyAcct, loading, error, deleteClearanceMoneyPropertyAcctById };
};

export default useDeleteClearanceMoneyPropertyAcctById;
