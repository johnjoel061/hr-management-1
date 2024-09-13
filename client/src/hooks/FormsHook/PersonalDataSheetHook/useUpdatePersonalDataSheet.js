import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdatePersonalDataSheetById = () => {
  const [loading, setLoading] = useState(false);

  const updatePersonalDataSheetById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'pdsScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('pdsScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('pdsScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/personal-data-sheet/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Personal Data Sheet (PDS) updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Personal Data Sheet (PDS)';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updatePersonalDataSheetById, loading };
};

export default useUpdatePersonalDataSheetById;
