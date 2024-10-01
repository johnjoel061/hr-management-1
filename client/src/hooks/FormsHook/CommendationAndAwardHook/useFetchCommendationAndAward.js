import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchCommendationAndAward = () => {
  const [commendationAndAward, setCommendationAndAward] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCommendationAndAward = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/commendations-and-awards/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCommendationAndAward(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommendationAndAward();
  }, [fetchCommendationAndAward]);

  const refetchCommendationAndAward = async () => {
    await fetchCommendationAndAward();
  };

  return { commendationAndAward, loading, error, refetchCommendationAndAward };
};

export default useFetchCommendationAndAward;
