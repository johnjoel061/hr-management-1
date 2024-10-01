import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateOrgStructureById = () => {
  const [loading, setLoading] = useState(false);

  const updateOrgStructureById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'orgScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('orgScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('orgScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`https://hr-management-1-baxp.onrender.com/api/organizational-structure/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Organizational Structure updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Organizational Structure';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateOrgStructureById, loading };
};

export default useUpdateOrgStructureById;
