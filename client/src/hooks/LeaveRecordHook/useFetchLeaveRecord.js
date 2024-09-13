import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchLeaveRecord = (userId) => {
  const [leaveRecord, setLeaveRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveRecord = useCallback(async () => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/employee/leave-record/${userId}/all`);

      if (response.status === 200) {
        setLeaveRecord(response.data.data);
        setError(null);
      } else {
        setError('Failed to retrieve Leave Record entries');
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
    fetchLeaveRecord();
  }, [fetchLeaveRecord]);

  const refetchLeaveRecord = async () => {
    await fetchLeaveRecord();
  };

  return { leaveRecord, loading, error, refetchLeaveRecord };
};

export default useFetchLeaveRecord;
