import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchOathOfOffice = () => {
  const [oathOfOffice, setOathOfOffice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOathOfOffice = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/oath-of-office/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOathOfOffice(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOathOfOffice();
  }, [fetchOathOfOffice]);

  const refetchOathOfOffice = async () => {
    await fetchOathOfOffice();
  };

  return { oathOfOffice, loading, error, refetchOathOfOffice };
};

export default useFetchOathOfOffice;
