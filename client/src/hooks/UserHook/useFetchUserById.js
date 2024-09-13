import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchUserById = (id) => {
  const [userData, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserById = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get(`http://localhost:3000/api/employee/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserById();
  }, [fetchUserById]);

  return { userData, loading, error };
};

export default useFetchUserById;
