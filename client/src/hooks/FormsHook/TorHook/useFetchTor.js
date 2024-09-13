import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchTor = () => {
  const [tor, setTor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTor = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/tor/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTor(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTor();
  }, [fetchTor]);

  const refetchTor = async () => {
    await fetchTor();
  };

  return { tor, loading, error, refetchTor };
};

export default useFetchTor;
