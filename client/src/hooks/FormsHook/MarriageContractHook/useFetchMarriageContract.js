import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useFetchMarriageContract = () => {
  const [marriageContract, setMarriageContract] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarriageContract = useCallback(async () => {
    setLoading(true); // Ensure loading state is true when refetching
    try {
      const response = await axios.get('http://localhost:3000/api/marriage-contract/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMarriageContract(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarriageContract();
  }, [fetchMarriageContract]);

  const refetchMarriageContract = async () => {
    await fetchMarriageContract();
  };

  return { marriageContract, loading, error, refetchMarriageContract };
};

export default useFetchMarriageContract;
