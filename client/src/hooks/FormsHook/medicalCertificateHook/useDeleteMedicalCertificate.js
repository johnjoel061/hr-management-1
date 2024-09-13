import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteMedicalCertificateById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedMedicalCertificate, setDeletedMedicalCertificate] = useState(null);

  const deleteMedicalCertificateById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/medical-certificate/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Medical Certificate');
      }

      setDeletedMedicalCertificate(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Medical Certificate deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Medical Certificate';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedMedicalCertificate, loading, error, deleteMedicalCertificateById };
};

export default useDeleteMedicalCertificateById;
