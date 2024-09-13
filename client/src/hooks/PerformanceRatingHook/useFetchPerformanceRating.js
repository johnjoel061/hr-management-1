import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchPerformanceRating = (userId) => {
  const [performanceRating, setPerformanceRating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformanceRating = useCallback(async () => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/employee/performance-rating/${userId}/all`);

      if (response.status === 200) {
        setPerformanceRating(response.data.data);
        setError(null);
        console.log('Fetched Service Record:', response.data.data);
      } else {
        setError('Failed to retrieve Performance Rating entries');
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
    fetchPerformanceRating();
  }, [fetchPerformanceRating]);

  const refetchPerformanceRating = async () => {
    await fetchPerformanceRating();
  };

  return { performanceRating, loading, error, refetchPerformanceRating };
};

export default useFetchPerformanceRating;
