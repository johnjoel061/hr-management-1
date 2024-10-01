import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSettingsById = (id) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`https://hr-management-1-baxp.onrender.com/api/settings/${id}`);
        setSettings(response.data.settings);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    if (id) {
      fetchSettings();
    }
  }, [id]);

  return { settings, loading, error };
};

export default useFetchSettingsById;
