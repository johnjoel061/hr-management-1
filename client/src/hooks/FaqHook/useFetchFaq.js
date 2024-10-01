import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchFaq = () => {
  const [faq, setFaq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaq = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/faqs/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFaq(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaq();
  }, [fetchFaq]);

  const refetchFaq = async () => {
    await fetchFaq();
  };

  return { faq, loading, error, refetchFaq };
};

export default useFetchFaq;
