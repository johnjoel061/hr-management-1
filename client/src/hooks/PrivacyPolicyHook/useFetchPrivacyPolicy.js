import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchPrivacyPolicy = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrivacyPolicy = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/privacy-policy/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPrivacyPolicy(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, [fetchPrivacyPolicy]);

  const refetchPrivacyPolicy = async () => {
    await fetchPrivacyPolicy();
  };

  return { privacyPolicy, loading, error, refetchPrivacyPolicy };
};

export default useFetchPrivacyPolicy;
