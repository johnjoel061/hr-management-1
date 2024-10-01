import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateNosiById = () => {
  const [loading, setLoading] = useState(false);

  const updateNosiById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'nosScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('nosScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('nosScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/nosi/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('NOSI/NOSA updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update NOSI/NOSA';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateNosiById, loading };
};

export default useUpdateNosiById;
