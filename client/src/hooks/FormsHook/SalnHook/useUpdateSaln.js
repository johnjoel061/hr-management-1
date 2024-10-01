import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateSalnById = () => {
  const [loading, setLoading] = useState(false);

  const updateSalnById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'salScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('salScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('salScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/saln/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('SALN updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update SALN';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateSalnById, loading };
};

export default useUpdateSalnById;
