import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateAssumptionOfDutyById = () => {
  const [loading, setLoading] = useState(false);

  const updateAssumptionOfDutyById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'assScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('assScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('assScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/assumption-of-duty/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Assumption of duty updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update assumption of duty';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateAssumptionOfDutyById, loading };
};

export default useUpdateAssumptionOfDutyById;
