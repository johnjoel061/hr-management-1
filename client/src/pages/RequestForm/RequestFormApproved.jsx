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
import useFetchAllRequestForm from "../../hooks/RequestFormHook/useFetchAllRequestForm";
import useDeleteRequestForm from "../../hooks/RequestFormHook/useDeleteRequestForm";

import { tokens } from "../../theme";
import Header from "../../components/Header";

const RequestFormApproved = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { requestForm, refetchAllRequestForm } = useFetchAllRequestForm();
  const { deleteRequestForm, loading: deleting } = useDeleteRequestForm();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequestFormId, setSelectedRequestFormId] = useState(null);

  const handleDeleteClick = (id) => {
    setSelectedRequestFormId(id);
    setOpenDialog(true);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
    setSelectedRequestFormId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRequestForm(selectedRequestFormId);
      await refetchAllRequestForm();
      // Refresh the list after deletion
    } catch (error) {
      message.error("Failed to delete certification request");
    } finally {
      handleCancelDelete(); // Close dialog after deletion
    }
  };

  // Filter the leave requests to show only rejected ones
  const approvedRequestForm = requestForm.filter(
    (request) => request.status === "approved"
  );

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
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
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
        <span style={{ fontWeight: "bold", color: "#388e3c" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
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
    const worksheet = XLSX.utils.json_to_sheet(approvedRequestForm);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "pending Req Data Sheets"
    );
    XLSX.writeFile(workbook, "approvedReq_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="REQUEST APPROVED"
        subtitle="List of requested certification approved of the Local Government Unit (LGU)"
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
          rows={approvedRequestForm || []}
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
            Are you sure you want to delete this certification request approved?
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

export default RequestFormApproved;
