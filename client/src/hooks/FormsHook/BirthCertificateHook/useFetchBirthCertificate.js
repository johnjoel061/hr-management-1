import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchBirthCertificate = () => {
  const [birthCertificate, setBirthCertificate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBirthCertificate = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/birth-certificate/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setBirthCertificate(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBirthCertificate();
  }, [fetchBirthCertificate]);

  const refetchBirthCertificate = async () => {
    await fetchBirthCertificate();
  };

  return { birthCertificate, loading, error, refetchBirthCertificate };
};

export default useFetchBirthCertificate;
