import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchMedicalCertificate = () => {
  const [medicalCertificate, setMedicalCertificate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMedicalCertificate = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/medical-certificate/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMedicalCertificate(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicalCertificate();
  }, [fetchMedicalCertificate]);

  const refetchMedicalCertificate = async () => {
    await fetchMedicalCertificate();
  };

  return { medicalCertificate, loading, error, refetchMedicalCertificate };
};

export default useFetchMedicalCertificate;
