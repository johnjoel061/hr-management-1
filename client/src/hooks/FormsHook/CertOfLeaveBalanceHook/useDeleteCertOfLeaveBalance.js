import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteCertOfLeaveBalanceById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedCertOfLeaveBalance, setDeletedCertOfLeaveBalance] = useState(null);

  const deleteCertOfLeaveBalanceById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/certificate-of-leave-balance/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Certificate of Leave Balances');
      }

      setDeletedCertOfLeaveBalance(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Certificate of Leave Balances deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Certificate of Leave Balances';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedCertOfLeaveBalance, loading, error, deleteCertOfLeaveBalanceById };
};

export default useDeleteCertOfLeaveBalanceById;
