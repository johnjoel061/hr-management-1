import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchDepartment = () => {
  const [department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartment = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/department/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setDepartment(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartment();
  }, [fetchDepartment]);

  const refetchDepartment = async () => {
    await fetchDepartment();
  };

  return { department, loading, error, refetchDepartment };
};

export default useFetchDepartment;
