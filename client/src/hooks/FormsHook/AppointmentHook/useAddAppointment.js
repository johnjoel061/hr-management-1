import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useAddAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addAppointment = async (appointmentData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(appointmentData).forEach((key) => {
        if (key === 'appScannedPicture' && appointmentData[key]) {
          Array.from(appointmentData[key]).forEach((file, index) => {
            formData.append('appScannedPicture', file, file.name); // Use a consistent key for multiple files
          });
        } else {
          formData.append(key, appointmentData[key]);
        }
      });

      // Make API request to add personal data sheet
      const response = await axios.post('http://localhost:3000/api/appointment/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle successful response
      if (response.status === 201) {
        message.success('Appointment added successfully');
        setLoading(false);
        setError(null); // Reset error state on successful submission
        return response.data.data.appointment;  
      } else {
        // Handle other status codes if necessary
        setError('Failed to add appointment');
      }
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message.includes('already exists')) {
        setError(error.response.data.message); // Set specific error message for duplicate title
      } else {
        setError('An error occurred. Please try again.'); // Generic error message for other errors
      }
      message.error('Add appointment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { addAppointment, loading, error };
};

export default useAddAppointment;
