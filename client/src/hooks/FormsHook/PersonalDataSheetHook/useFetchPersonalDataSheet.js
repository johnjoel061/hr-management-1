import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchPersonalDataSheet = () => {
  const [personalDataSheet, setPersonalDataSheet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPersonalDataSheet = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/personal-data-sheet/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPersonalDataSheet(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPersonalDataSheet();
  }, [fetchPersonalDataSheet]);

  const refetchPersonalDataSheet = async () => {
    await fetchPersonalDataSheet();
  };

  return { personalDataSheet, loading, error, refetchPersonalDataSheet };
};

export default useFetchPersonalDataSheet;
