import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchCalendar = () => {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCalendar = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/calendar/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCalendar(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const refetchCalendar = async () => {
    await fetchCalendar();
  };

  return { calendar, loading, error, refetchCalendar };
};

export default useFetchCalendar;
