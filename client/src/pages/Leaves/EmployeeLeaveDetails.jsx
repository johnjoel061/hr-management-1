import useFetchLeaveRequestById from "../../hooks/LeaveRequestHook/useFetchLeaveRequestById";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { CircularProgress, Typography, Box, Button } from "@mui/material";
import jsPDF from "jspdf";

const EmployeeLeaveDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();

  const {
    leaveRequestData,
    loading: leaveLoading,
    error: leaveError,
  } = useFetchLeaveRequestById(id);

  // Function to generate PDF using jsPDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Employee Leave Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Employee Name: ${leaveRequestData.firstName} ${leaveRequestData.lastName}`, 20, 30);
    doc.text(`Position: ${leaveRequestData.position}`, 20, 40);
    doc.text(`Department: ${leaveRequestData.department}`, 20, 50);
    doc.text(`Leave Type: ${leaveRequestData.leaveType}`, 20, 60);
    
    if (leaveRequestData.otherLeaveType) {
      doc.text(`Other Leave Type: ${leaveRequestData.otherLeaveType}`, 20, 70);
    }
    
    doc.text(`Start Date: ${new Date(leaveRequestData.startDate).toLocaleDateString()}`, 20, 80);
    doc.text(`End Date: ${new Date(leaveRequestData.endDate).toLocaleDateString()}`, 20, 90);
    doc.text(`Status: ${leaveRequestData.status}`, 20, 100);

    // Save the generated PDF
    doc.save(`leave_request_${leaveRequestData.lastName}.pdf`);
  };

  if (leaveLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (leaveError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">Error fetching leave request: {leaveError.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '20px', backgroundColor: colors.background, color: colors.text }}>
      <Typography variant="h4" gutterBottom>Employee Leave Details</Typography>
      {leaveRequestData ? (
        <Box>
          <Typography variant="h6">Employee Information</Typography>
          <Typography>First Name: {leaveRequestData.firstName}</Typography>
          <Typography>Last Name: {leaveRequestData.lastName}</Typography>
          <Typography>Position: {leaveRequestData.position}</Typography>
          <Typography>Department: {leaveRequestData.department}</Typography>

          <Box mt={4}>
            <Typography variant="h6">Leave Details</Typography>
            <Typography>Leave Type: {leaveRequestData.leaveType}</Typography>
            {leaveRequestData.otherLeaveType && (
              <Typography>Other Leave Type: {leaveRequestData.otherLeaveType}</Typography>
            )}
            <Typography>Start Date: {new Date(leaveRequestData.startDate).toLocaleDateString()}</Typography>
            <Typography>End Date: {new Date(leaveRequestData.endDate).toLocaleDateString()}</Typography>
            <Typography>Status: {leaveRequestData.status}</Typography>
          </Box>

          {/* Button to download PDF */}
          <Button variant="contained" color="primary" onClick={generatePDF} sx={{ mt: 4 }}>
            Download PDF
          </Button>
        </Box>
      ) : (
        <Typography>No leave request data found.</Typography>
      )}
    </Box>
  );
};

export default EmployeeLeaveDetails;
