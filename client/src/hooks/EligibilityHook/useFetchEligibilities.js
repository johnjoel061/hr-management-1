import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchEligibilities = () => {
  const [eligibilities, setEligibilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEligibilities = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/eligibility/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEligibilities(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEligibilities();
  }, [fetchEligibilities]);

  const refetchEligibilities = async () => {
    await fetchEligibilities();
  };

  return { eligibilities, loading, error, refetchEligibilities };
};

export default useFetchEligibilities;
