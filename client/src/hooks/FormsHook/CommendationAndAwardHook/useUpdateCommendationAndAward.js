import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateCommendationAndAwardById = () => {
  const [loading, setLoading] = useState(false);

  const updateCommendationAndAwardById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'comScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('comScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('comScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/commendations-and-awards/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Commendation and Award updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Commendation and Award';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateCommendationAndAwardById, loading };
};

export default useUpdateCommendationAndAwardById;
