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
  FormControl,
} from "@mui/material";
import { message } from "antd";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import useFetchAllRequestForm from "../../hooks/RequestFormHook/useFetchAllRequestForm";
import useApprovedRequestForm from "../../hooks/RequestFormHook/useApprovedRequestForm"; // Import the hook

import { tokens } from "../../theme";
import Header from "../../components/Header";

const RequestFormPending = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { requestForm, refetchAllRequestForm } = useFetchAllRequestForm();
  const { approveRequestForm, loading } = useApprovedRequestForm(); // Destructure the hook
  const [selectedRequestForm, setSelectedRequestForm] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [file, setFile] = useState(null); // State for storing the uploaded file
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  // Filter the leave requests to show only pending ones
  const pendingRequestForm = requestForm.filter(
    (request) => request.status === "pending"
  );

  const handleApprove = async () => {
    if (selectedRequestForm && file) {
      try {
        await approveRequestForm(selectedRequestForm._id, file);
        refetchAllRequestForm(); // Refetch the data after approving
        setOpenApproveDialog(false);
        setFile(null); // Clear the file input
      } catch (error) {
        message.error("Error approving request:", error);
      }
    } else {
      message.error("Please select a file before approving.");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleReject = async () => {
    if (selectedRequestForm) {
      try {
        await approveRequestForm(selectedRequestForm._id, null, rejectReason);
        refetchAllRequestForm(); // Refresh the data after rejection
        setOpenRejectDialog(false);
        setRejectReason(""); // Reset the rejection reason input after submission
      } catch (error) {
        message.error("Error rejecting request:", error);
      }
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "middleName", headerName: "Middle Name", width: 200 },
    { field: "suffix", headerName: "Suffix", width: 120 },
    {
      field: "dateOfBirth",
      headerName: "Date of Birth",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    { field: "position", headerName: "Position", width: 200 },
    { field: "gmail", headerName: "Gmail", width: 200 },

    { field: "department", headerName: "Department", width: 200 },
    { field: "employmentType", headerName: "Employment Type", width: 200 },
    {
      field: "certificationType",
      headerName: "Requested Certificate",
      width: 250,
    },
    {
      field: "dateRequested",
      headerName: "Date Requested",
      width: 200,
      renderCell: (params) => (
        <span>
          {params.value
            ? format(new Date(params.value), "MMMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    { field: "salaryOption", headerName: "Salary Option", width: 180 },
    {
      field: "dateFrom",
      headerName: "Date From",
      width: 200,
      renderCell: (params) => (
        <span>
          {params.value
            ? format(new Date(params.value), "MMMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    {
      field: "dateTo",
      headerName: "Date To",
      width: 200,
      renderCell: (params) => (
        <span>
          {params.value
            ? format(new Date(params.value), "MMMM d, yyyy")
            : "N/A"}
        </span>
      ),
    },
    { field: "purpose", headerName: "Purpose", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <span style={{ fontWeight: "bold", color: "#a59114" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedRequestForm(params.row);
              setOpenApproveDialog(true);
            }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => {
              setSelectedRequestForm(params.row);
              setOpenRejectDialog(true);
            }}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ];

  //EXPORT DATA EXCEL
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pendingRequestForm);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "pending req Data Sheets"
    );
    XLSX.writeFile(workbook, "pendingRequestForm_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="CERTIFICATION REQUESTS PENDING"
        subtitle="List of certification requests pending of the Local Government Unit (LGU)"
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
          rows={pendingRequestForm || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to approve this Request?
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <input
              type="file"
              onChange={handleFileChange}
              style={{ marginTop: 10 }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpenApproveDialog(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleApprove} disabled={loading}>
            Approved
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => setOpenRejectDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Rejection</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to reject this Leave Request?
          </DialogContentText>
          <TextField
            margin="normal"
            label="Rejection Reason"
            name="rejectReason"
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "gray", // Border color on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7b7f89", // Border color when focused
                },
              },
              "& .MuiInputLabel-shrink": {
                color: "#9b9ea6", // Label color when field is focused
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpenRejectDialog(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleReject} disabled={loading}>
            {loading ? "Rejecting..." : "Reject"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestFormPending;
