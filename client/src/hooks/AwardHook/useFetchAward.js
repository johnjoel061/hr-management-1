import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchAward = (userId) => {
  const [award, setAward] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAward = useCallback(async () => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://hr-management-1-baxp.onrender.com/api/employee/awards/${userId}/all`);

      if (response.status === 200) {
        setAward(response.data.data);
        setError(null);
      } else {
        setError('Failed to retrieve Award entries');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAward();
  }, [fetchAward]);

  const refetchAward = async () => {
    await fetchAward();
  };

  return { award, loading, error, refetchAward };
};

export default useFetchAward;
