import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchAppointment = () => {
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointment = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/appointment/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAppointment(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const refetchAppointment = async () => {
    await fetchAppointment();
  };

  return { appointment, loading, error, refetchAppointment };
};

export default useFetchAppointment;
