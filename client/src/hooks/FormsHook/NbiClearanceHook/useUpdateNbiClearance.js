import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';


const useUpdateNbiClearanceById = () => {
  const [loading, setLoading] = useState(false);

  const updateNbiClearanceById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'nbiScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('nbiScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('nbiScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/nbi-clearance/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('NBI Clearance updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update NBI Clearance';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateNbiClearanceById, loading };
};

export default useUpdateNbiClearanceById;
