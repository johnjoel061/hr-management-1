import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchLeaveType = () => {
  const [leaveType, setLeaveType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaveType = useCallback(async () => {
    setLoading(true); 
    try {
      const response = await axios.get('http://localhost:3000/api/leave-type/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setLeaveType(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaveType();
  }, [fetchLeaveType]);

  const refetchLeaveType = async () => {
    await fetchLeaveType();
  };

  return { leaveType, loading, error, refetchLeaveType };
};

export default useFetchLeaveType;
