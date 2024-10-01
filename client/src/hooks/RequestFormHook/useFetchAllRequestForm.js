import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchAllRequestForm = () => {
  const [requestForm, setRequestForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllRequestForm = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/request-form/certification/getAll', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setRequestForm(response.data.requestForm);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRequestForm();
  }, [fetchAllRequestForm]);

  const refetchAllRequestForm = async () => {
    await fetchAllRequestForm();
  };

  return { requestForm, loading, error, refetchAllRequestForm };
};

export default useFetchAllRequestForm;
