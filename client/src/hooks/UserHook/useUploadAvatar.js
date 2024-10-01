import { useState, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUploadAvatar = (userId, onAvatarUpdate) => {
  const [loading, setLoading] = useState(false);

  const uploadAvatar = useCallback(async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/employee/users/${userId}/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Profile picture updated successfully');
      onAvatarUpdate(response.data.avatar); // Call the function to refresh the avatar
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload profile picture';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, onAvatarUpdate]);

  return { uploadAvatar, loading };
};

export default useUploadAvatar;
