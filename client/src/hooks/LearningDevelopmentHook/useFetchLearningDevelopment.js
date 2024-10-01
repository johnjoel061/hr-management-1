import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchLearningDevelopment = (userId) => {
  const [learningDevelopment, setLearningDevelopment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLearningDevelopment = useCallback(async () => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`https://hr-management-1-baxp.onrender.com/api/employee/learning-development/${userId}/all`);

      if (response.status === 200) {
        setLearningDevelopment(response.data.data);
        setError(null);
      } else {
        setError('Failed to retrieve learning development entries');
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
    fetchLearningDevelopment();
  }, [fetchLearningDevelopment]);

  const refetchLearningDevelopment = async () => {
    await fetchLearningDevelopment();
  };

  return { learningDevelopment, loading, error, refetchLearningDevelopment };
};

export default useFetchLearningDevelopment;
