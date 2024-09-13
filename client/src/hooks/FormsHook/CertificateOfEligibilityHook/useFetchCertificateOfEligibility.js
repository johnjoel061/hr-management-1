import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchCertificateOfEligibility = () => {
  const [certificateOfEligibility, setCertificateOfEligibility] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificateOfEligibility = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/certificate-of-eligibility/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCertificateOfEligibility(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificateOfEligibility();
  }, [fetchCertificateOfEligibility]);

  const refetchCertificateOfEligibility = async () => {
    await fetchCertificateOfEligibility();
  };

  return { certificateOfEligibility, loading, error, refetchCertificateOfEligibility };
};

export default useFetchCertificateOfEligibility;
