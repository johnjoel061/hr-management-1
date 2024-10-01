import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdatePositionDescriptionFormById = () => {
  const [loading, setLoading] = useState(false);

  const updatePositionDescriptionFormById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'posScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('posScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('posScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/position-description-form/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Position Description Form updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Position Description Form';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updatePositionDescriptionFormById, loading };
};

export default useUpdatePositionDescriptionFormById;
