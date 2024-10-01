import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchLeaveCredit = (userId) => {
  const [leaveCredit, setLeaveCredit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveCredit = useCallback(async () => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://hr-management-1-baxp.onrender.com/api/employee/leave-credit/${userId}/all`);

      if (response.status === 200) {
        setLeaveCredit(response.data.data);
        setError(null);
      } else {
        setError('Failed to retrieve Leave Credit entries');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLeaveCredit();
  }, [fetchLeaveCredit]);

  const refetchLeaveCredit = async () => {
    await fetchLeaveCredit();
  };

  return { leaveCredit, loading, error, refetchLeaveCredit };
};

export default useFetchLeaveCredit;
