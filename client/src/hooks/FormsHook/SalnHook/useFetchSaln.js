import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchSaln = () => {
  const [saln, setSaln] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSaln = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/saln/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSaln(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSaln();
  }, [fetchSaln]);

  const refetchSaln = async () => {
    await fetchSaln();
  };

  return { saln, loading, error, refetchSaln };
};

export default useFetchSaln;
