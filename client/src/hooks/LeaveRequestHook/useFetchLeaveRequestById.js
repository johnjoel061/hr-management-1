import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchLeaveRequestById = (leaveRequestId) => {
  const [leaveRequestData, setLeaveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveRequestById = useCallback(async () => {
    setLoading(true); // Set loading state to true when fetching starts
    try {
      console.log(`Fetching leave request with ID: ${leaveRequestId}`);
      const response = await axios.get(`https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/${leaveRequestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLeaveRequest(response.data.leaveRequest);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [leaveRequestId]);

  useEffect(() => {
    if (leaveRequestId) {
      fetchLeaveRequestById();
    }
  }, [fetchLeaveRequestById]);

  return { leaveRequestData, loading, error };
};

export default useFetchLeaveRequestById;
