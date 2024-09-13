import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useUpdateCertificateOfEligibilityById = () => {
  const [loading, setLoading] = useState(false);

  const updateCertificateOfEligibilityById = async (id, updatedData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append updated fields
      Object.keys(updatedData).forEach((key) => {
        if (key === 'cerScannedPicture' && Array.isArray(updatedData[key])) {
          updatedData[key].forEach((item) => {
            if (typeof item === 'string') {
              // Append existing image paths as strings
              formData.append('cerScannedPicture[]', item);
            } else {
              // Append new image files
              formData.append('cerScannedPicture[]', item);
            }
          });
        } else {
          // Append other fields
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(`http://localhost:3000/api/certificate-of-eligibility/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      message.success('Certificate of Eligibility updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update Certificate of Eligibility';
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateCertificateOfEligibilityById, loading };
};

export default useUpdateCertificateOfEligibilityById;
