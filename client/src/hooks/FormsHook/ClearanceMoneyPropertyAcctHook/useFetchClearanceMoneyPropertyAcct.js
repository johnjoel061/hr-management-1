import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchClearanceMoneyPropertyAcct = () => {
  const [clearanceMoneyPropertyAcct, setClearanceMoneyPropertyAcct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClearanceMoneyPropertyAcct = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/clearance-from-money-and-property-accountabilities/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setClearanceMoneyPropertyAcct(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClearanceMoneyPropertyAcct();
  }, [fetchClearanceMoneyPropertyAcct]);

  const refetchClearanceMoneyPropertyAcct = async () => {
    await fetchClearanceMoneyPropertyAcct();
  };

  return { clearanceMoneyPropertyAcct, loading, error, refetchClearanceMoneyPropertyAcct };
};

export default useFetchClearanceMoneyPropertyAcct;
