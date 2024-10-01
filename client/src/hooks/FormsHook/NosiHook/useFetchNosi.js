import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchNosi = () => {
  const [nosi, setNosi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNosi = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/nosi/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNosi(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNosi();
  }, [fetchNosi]);

  const refetchNosi = async () => {
    await fetchNosi();
  };

  return { nosi, loading, error, refetchNosi };
};

export default useFetchNosi;
