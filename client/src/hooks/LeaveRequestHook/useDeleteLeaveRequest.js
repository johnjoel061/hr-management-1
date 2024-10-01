import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteLeaveRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedLeaveRequest, setDeletedLeaveRequest] = useState(null);

  const deleteLeaveRequest = async (leaveRequestId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/${leaveRequestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete leave request');
      }

      setDeletedLeaveRequest(response.data.leaveRequest);
      message.success('Leave request deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete leave request';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteLeaveRequest, loading, error, deletedLeaveRequest };
};

export default useDeleteLeaveRequest;
