import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd'; // Assuming you're using Ant Design for notifications

const useApprovedLeaveRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const approveLeaveRequest = async ({ requestId, status, role, rejectReason }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(`http://localhost:3000/api/employee/leave-requests/status/${requestId}`, {
                status,
                role,
                rejectReason,
            });

            if (response.data.status === 'success') {
                message.success(`Leave request ${status} successfully`);
            } else {
                message.error('Something went wrong while updating the leave request');
            }
        } catch (err) {
            setError(err);
            message.error('Error updating leave request');
        } finally {
            setLoading(false);
        }
    };

    return { approveLeaveRequest, loading, error };
};

export default useApprovedLeaveRequest;
