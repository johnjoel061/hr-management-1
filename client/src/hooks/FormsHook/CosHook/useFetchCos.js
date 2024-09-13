import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchCos = () => {
  const [cos, setCos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCos = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/contract-of-service/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCos(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCos();
  }, [fetchCos]);

  const refetchCos = async () => {
    await fetchCos();
  };

  return { cos, loading, error, refetchCos };
};

export default useFetchCos;
