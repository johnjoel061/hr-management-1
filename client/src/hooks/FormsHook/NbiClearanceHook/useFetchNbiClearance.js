import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchNbiClearance = () => {
  const [nbiClearance, setNbiClearance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNbiClearance = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/nbi-clearance/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNbiClearance(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNbiClearance();
  }, [fetchNbiClearance]);

  const refetchNbiClearance = async () => {
    await fetchNbiClearance();
  };

  return { nbiClearance, loading, error, refetchNbiClearance };
};

export default useFetchNbiClearance;
