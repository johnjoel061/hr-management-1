import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchDesignation = () => {
  const [designation, setDesignation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDesignation = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/designation/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDesignation(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesignation();
  }, [fetchDesignation]);

  const refetchDesignation = async () => {
    await fetchDesignation();
  };

  return { designation, loading, error, refetchDesignation };
};

export default useFetchDesignation;
