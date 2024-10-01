import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchAssumptionOfDuty = () => {
  const [assumptionOfDuty, setAssumptionOfDuty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssumptionOfDuty = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/assumption-of-duty/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAssumptionOfDuty(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssumptionOfDuty();
  }, [fetchAssumptionOfDuty]);

  const refetchAssumptionOfDuty = async () => {
    await fetchAssumptionOfDuty();
  };

  return { assumptionOfDuty, loading, error, refetchAssumptionOfDuty };
};

export default useFetchAssumptionOfDuty;
