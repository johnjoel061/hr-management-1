import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchCertOfLeaveBalance = () => {
  const [certOfLeaveBalance, setCertOfLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertOfLeaveBalance = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/certificate-of-leave-balance/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCertOfLeaveBalance(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertOfLeaveBalance();
  }, [fetchCertOfLeaveBalance]);

  const refetchCertOfLeaveBalance = async () => {
    await fetchCertOfLeaveBalance();
  };

  return { certOfLeaveBalance, loading, error, refetchCertOfLeaveBalance };
};

export default useFetchCertOfLeaveBalance;
