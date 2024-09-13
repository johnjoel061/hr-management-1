import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchOrgStructure = () => {
  const [orgStructure, setOrgStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrgStructure = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/organizational-structure/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrgStructure(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgStructure();
  }, [fetchOrgStructure]);

  const refetchOrgStructure = async () => {
    await fetchOrgStructure();
  };

  return { orgStructure, loading, error, refetchOrgStructure };
};

export default useFetchOrgStructure;
