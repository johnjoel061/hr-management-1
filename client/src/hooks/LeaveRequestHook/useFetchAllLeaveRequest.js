import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchAllLeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllLeaveRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setLeaveRequests(response.data.leaveRequests);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllLeaveRequests();
  }, [fetchAllLeaveRequests]);

  const refetchLeaveRequests = async () => {
    await fetchAllLeaveRequests();
  };

  return { leaveRequests, loading, error, refetchLeaveRequests };
};

export default useFetchAllLeaveRequest;
