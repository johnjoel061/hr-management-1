import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchServiceRecord = (userId) => {
  const [serviceRecord, setServiceRecord] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceRecord = useCallback(async () => {
    if (!userId) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/employee/service-record/${userId}/all`);

      if (response.status === 200) {
        setServiceRecord(response.data.data);
        setError(null);
      } else {
        setError('Failed to retrieve Service Record entries');
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
    fetchServiceRecord();
  }, [fetchServiceRecord]);

  const refetchServiceRecord = async () => {
    await fetchServiceRecord();
  };

  return { serviceRecord, loading, error, refetchServiceRecord };
};

export default useFetchServiceRecord;
