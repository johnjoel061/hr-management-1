import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateCopiesOfDiscipActionById = () => {
  const [loading, setLoading] = useState(false);

  const updateCopiesOfDiscipActionById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'copScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('copScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('copScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/copies-of-disciplinary-actions/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Copies of Disciplinary Action updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Copies of Disciplinary Action';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateCopiesOfDiscipActionById, loading };
};

export default useUpdateCopiesOfDiscipActionById;
