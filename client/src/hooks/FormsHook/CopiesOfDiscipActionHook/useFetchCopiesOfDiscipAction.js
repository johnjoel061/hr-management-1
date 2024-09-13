import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchCopiesOfDiscipAction = () => {
  const [copiesOfDiscipAction, setCopiesOfDiscipAction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCopiesOfDiscipAction = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/copies-of-disciplinary-actions/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCopiesOfDiscipAction(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCopiesOfDiscipAction();
  }, [fetchCopiesOfDiscipAction]);

  const refetchCopiesOfDiscipAction = async () => {
    await fetchCopiesOfDiscipAction();
  };

  return { copiesOfDiscipAction, loading, error, refetchCopiesOfDiscipAction };
};

export default useFetchCopiesOfDiscipAction;
