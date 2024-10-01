import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);

  const updateSettings = async (id, updatedSettings, files) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('lguName', updatedSettings.lguName || '');
      formData.append('lguGmail', updatedSettings.lguGmail || '');

      // Append files to formData if present
      if (files) {
        for (const key in files) {
          if (files[key]) {
            formData.append(key, files[key]);
          }
        }
      }

      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/settings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSettings(response.data.settings);
      message.success('Settings updated successfully!');
      return response.data.settings; // Return updated settings

    } catch (err) {
      setError(err);
      message.error('Failed to update settings. Please try again.');
      throw err; // Rethrow error for further handling
    } finally {
      setIsLoading(false);
    }
  };

  return { updateSettings, isLoading, error, settings };
};

export default useUpdateSettings;
