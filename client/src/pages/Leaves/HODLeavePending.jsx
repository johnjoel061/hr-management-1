import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import { useAuth } from "../../contexts/AuthContext";
import useFetchAllLeaveRequest from "../../hooks/LeaveRequestHook/useFetchAllLeaveRequest";
import useApprovedLeaveRequest from "../../hooks/LeaveRequestHook/useApprovedLeaveRequest";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const HODLeavePending = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { userData } = useAuth();
  const { leaveRequests, refetchLeaveRequests } = useFetchAllLeaveRequest();
  const { approveLeaveRequest, loading: updateLoading } = useApprovedLeaveRequest();
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isApprovalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setRejectionDialogOpen] = useState(false);

  const downloadLeaveRequestPDF = (id) => {
    window.open(`https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/${id}/pdf`, '_blank');
  };
  
  // Filter the leave requests to show only pending ones
  const pendingLeaveRequests = leaveRequests.filter(
    (request) => request.status === "pending"
  );

  const handleApprove = async () => {
    if (selectedRequest) {
      await approveLeaveRequest({
        requestId: selectedRequest._id,
        status: "approved",
        role: "HOD", // Adjust role as needed
        hodFirstName: userData.firstName, // Using HOD data from userData
        hodMiddleName: userData.middleName,
        hodLastName: userData.lastName,
        hodSignature: userData.signature,
      });
      setApprovalDialogOpen(false);
      refetchLeaveRequests();
    }
  };

  const handleReject = async () => {
    if (selectedRequest) {
      await approveLeaveRequest({
        requestId: selectedRequest._id,
        status: "disapproved",
        role: "HOD", // Adjust role as needed
        rejectReason,
        hodFirstName: userData.firstName, // Using HOD data from userData
        hodMiddleName: userData.middleName,
        hodLastName: userData.lastName,
        hodSignature: userData.signature, 
      });
      setRejectionDialogOpen(false);
      refetchLeaveRequests();
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "middleName", headerName: "Middle Name", width: 200 },
    { field: "suffix", headerName: "Suffix", width: 120 },
    {
      field: "dateOfFiling",
      headerName: "Date of Filing",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    { field: "position", headerName: "Position", width: 200 },
    { field: "gmail", headerName: "Gmail", width: 200 },

    { field: "leaveType", headerName: "Leave Type", width: 500 },

    {
      field: "startDate",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "hodApproval",
      headerName: "Department Head",
      width: 200,
      renderCell: (params) => {
        // Determine the color based on the value
        const color = params.value === "approved" ? "green" : "#CDB008"; // Green for approved, else default color
        return (
          <span style={{ fontWeight: "bold", color }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "adminApproval",
      headerName: "Authorized Officer",
      width: 200,
      renderCell: (params) => {
        // Determine the color based on the value
        const color = params.value === "approved" ? "green" : "#CDB008"; // Green for approved, else default color
        return (
          <span style={{ fontWeight: "bold", color }}>
            {params.value}
          </span>
        );
      },
    },
    {
     field: "mAdminApproval",
     headerName: "Municipal Administrator",
     width: 200,
     renderCell: (params) => {
        // Determine the color based on the value
        const color = params.value === "approved" ? "green" : "#CDB008"; // Green for approved, else default color
        return (
        <span style={{ fontWeight: "bold", color }}>
            {params.value}
        </span>
        );
     },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <span style={{ fontWeight: "bold", color: "#CDB008" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 275,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 8, backgroundColor: '#4d55b3' }}
            onClick={() => downloadLeaveRequestPDF(params.row._id)}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedRequest(params.row);
              setApprovalDialogOpen(true);
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              setSelectedRequest(params.row);
              setRejectionDialogOpen(true);
            }}
          >
            Disapprove
          </Button>
        </Box>
      ),
    },
  ];

  //EXPORT DATA EXCEL
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pendingLeaveRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "pending leave Data Sheets"
    );
    XLSX.writeFile(workbook, "pendingLeaveRequests_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="LEAVE REQUESTS PENDING"
        subtitle="List of Leave requests pending of the Local Government Unit (LGU)"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#388E3C",
            color: "#e0e0e0",
            margin: "0 20px",
            "&:hover": {
              backgroundColor: "#45A049",
            },
          }}
          onClick={handleExportToExcel}
        >
          <Box display="flex" alignItems="center">
            <Box mr={1}>Export to Excel</Box>
            <FeedOutlinedIcon />
          </Box>
        </Button>
      </Box>

      <Box
        m="20px 0 0 0"
        height="62vh"
        width="80vw"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={pendingLeaveRequests || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog
        open={isApprovalDialogOpen}
        onClose={() => setApprovalDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to approve this Leave Request?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setApprovalDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="error"
            disabled={updateLoading}
            onClick={handleApprove}
          >
            {updateLoading ? "Approving..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={isRejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Disapproval</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to disapproved this Leave Request?
          </DialogContentText>
          <TextField
            margin="dense"
            label="Disapproval Reason"
            name="rejectReason"
            fullWidth
            variant="outlined"
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => setRejectionDialogOpen(false)} 
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            disabled={updateLoading || !rejectReason}
          >
            {updateLoading ? "Disapproving..." : "Disapprove"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HODLeavePending;
