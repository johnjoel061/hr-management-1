import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { message } from "antd";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import useFetchAllLeaveRequest from "../../hooks/LeaveRequestHook/useFetchAllLeaveRequest";
import useDeleteLeaveRequest from "../../hooks/LeaveRequestHook/useDeleteLeaveRequest";

import { tokens } from "../../theme";
import Header from "../../components/Header";

const LeaveDisapproved = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { leaveRequests, refetchLeaveRequests } =
  useFetchAllLeaveRequest();
  const { deleteLeaveRequest, loading: deleting } = useDeleteLeaveRequest();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLeaveRequestId, setSelectedLeaveRequestId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedLeaveRequestId(id);
    setOpenDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedLeaveRequestId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLeaveRequest(selectedLeaveRequestId);
      await refetchLeaveRequests();
       // Refresh the list after deletion
    } catch (error) {
      message.error('Failed to delete leave request');
    } finally {
      handleCancelDelete(); // Close dialog after deletion
    }
    
  };


   // Filter the leave requests to show only disapproved ones
   const disapprovedLeaveRequests = leaveRequests.filter(
    (request) => request.status === "disapproved"
  );

  const downloadLeaveRequestPDF = (id) => {
    window.open(`https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/${id}/pdf`, '_blank');
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
    { field: "gmail", headerName: "Email", width: 200 },

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
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <span style={{ fontWeight: "bold", color: "#f44235" }}>
          {params.value}
        </span>
      ),
    },
    { field: "rejectReason", headerName: "Reason/s why disapproved", width: 200 },
    
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
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
            color="error"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleDeleteClick(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  //EXPORT DATA EXCEL
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(disapprovedLeaveRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "disapproved leave Data Sheets"
    );
    XLSX.writeFile(workbook, "disapprovedLeaveRequests_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="LEAVE REQUESTS DISAPPROVED"
        subtitle="List of Leave requests disapproved of the Local Government Unit (LGU)"
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
          rows={disapprovedLeaveRequests || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Leave Disapproved?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="primary"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveDisapproved;
