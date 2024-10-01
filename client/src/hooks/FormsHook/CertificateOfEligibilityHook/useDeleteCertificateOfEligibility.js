import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteCertificateOfEligibilityById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedCertificateOfEligibility, setDeletedCertificateOfEligibility] = useState(null);

  const deleteCertificateOfEligibilityById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`https://hr-management-1-baxp.onrender.com/api/certificate-of-eligibility/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete Certificate of Eligibility');
      }

      setDeletedCertificateOfEligibility(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('Certificate of Eligibility deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete Certificate of Eligibility';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedCertificateOfEligibility, loading, error, deleteCertificateOfEligibilityById };
};

export default useDeleteCertificateOfEligibilityById;
