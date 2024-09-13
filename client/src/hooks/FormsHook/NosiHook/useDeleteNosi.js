import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useDeleteNosiById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletedNosi, setDeletedNosi] = useState(null);

  const deleteNosiById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`http://localhost:3000/api/nosi/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.data || response.status !== 200) {
        throw new Error(response.data.message || 'Failed to delete NOSI/NOSA');
      }

      setDeletedNosi(response.data.data); // Assuming response.data.data contains the deleted user info
      message.success('NOSI/NOSA deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete NOSI/NOSA';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deletedNosi, loading, error, deleteNosiById };
};

export default useDeleteNosiById;
