import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchAllSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://hr-management-1-baxp.onrender.com/api/settings');
        setSettings(response.data.settings);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

export default useFetchAllSettings;
