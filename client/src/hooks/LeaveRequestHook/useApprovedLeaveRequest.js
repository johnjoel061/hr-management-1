import { useState } from "react";
import axios from "axios";
import { message } from "antd"; // Assuming you're using Ant Design for notifications

const useApprovedLeaveRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const approveLeaveRequest = async ({
    requestId,
    status,
    role,
    rejectReason,
    //HOD
    hodFirstName,
    hodMiddleName,
    hodLastName,
    hodSignature,
    //VACATION CREDITS
    vacationLeaveTE,
    vacationLeaveLA,
    vacationLeaveBalance,
    //SICK CREDITS
    sickLeaveTE,
    sickLeaveLA,
    sickLeaveBalance,
    //M-ADMIN
    daysWithPay,
    daysWithoutPay,
    others,
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/status/${requestId}`,
        {
          status,
          role,
          rejectReason,
          //HOD
          hodFirstName,
          hodMiddleName,
          hodLastName,
          hodSignature,
          //VACATION CREDITS
          vacationLeaveTE,
          vacationLeaveLA,
          vacationLeaveBalance,
          //SICK CREDITS
          sickLeaveTE,
          sickLeaveLA,
          sickLeaveBalance,
          //M-ADMIN
          daysWithPay,
          daysWithoutPay,
          others,
        }
      );

      if (response.data.status === "success") {
        message.success(`Leave request ${status} successfully`);
      } else {
        message.error("Something went wrong while updating the leave request");
      }
    } catch (err) {
      setError(err);
      message.error("Error updating leave request");
    } finally {
      setLoading(false);
    }
  };

  return { approveLeaveRequest, loading, error };
};

export default useApprovedLeaveRequest;
