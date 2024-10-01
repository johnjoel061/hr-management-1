import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteBirthCertificateById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedBirthCertificate, setDeletedBirthCertificate] = useState(null);

  const deleteBirthCertificateById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/birth-certificate/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Birth Certificate');
      }

      setDeletedBirthCertificate(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Birth Certificate deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Birth Certificate';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedBirthCertificate, loading, error, deleteBirthCertificateById };
};

export default useDeleteBirthCertificateById;
