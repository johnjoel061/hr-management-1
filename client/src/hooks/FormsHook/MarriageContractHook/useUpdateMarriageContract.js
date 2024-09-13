import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateMarriageContractById = () => {
  const [loading, setLoading] = useState(false);

  const updateMarriageContractById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'marScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('marScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('marScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/marriage-contract/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Marriage Contract updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Marriage Contract';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateMarriageContractById, loading };
};

export default useUpdateMarriageContractById;
