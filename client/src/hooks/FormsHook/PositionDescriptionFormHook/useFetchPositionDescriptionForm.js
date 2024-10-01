import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchPositionDescriptionForm = () => {
  const [positionDescriptionForm, setPositionDescriptionForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPositionDescriptionForm = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/position-description-form/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPositionDescriptionForm(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositionDescriptionForm();
  }, [fetchPositionDescriptionForm]);

  const refetchPositionDescriptionForm = async () => {
    await fetchPositionDescriptionForm();
  };

  return { positionDescriptionForm, loading, error, refetchPositionDescriptionForm };
};

export default useFetchPositionDescriptionForm;
