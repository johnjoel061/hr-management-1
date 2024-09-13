import Header from "../../components/Header";
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
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import useFetchDepartment from "../../hooks/DepartmentHook/useFetchDepartment";
import useDeleteDepartment from "../../hooks/DepartmentHook/useDeleteDepartment";
import useUpdateDepartment from "../../hooks/DepartmentHook/useUpdateDepartment";
import { useState } from "react";
import { message } from "antd";

const DepartmentList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { department, refetchDepartment } = useFetchDepartment();
  const { deleteDepartmentById, loading: deleteLoading } =
    useDeleteDepartment();
  const { updateDepartmentById, loading: updateLoading } =
    useUpdateDepartment();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState({});

  // Function to handle edit button click
  const handleEditClick = (id) => {
    // Implement your edit logic here, e.g., navigate to edit page
    const departments = department.find((department) => department._id === id);
    setSelectedDepartment(departments);
    setSelectedDepartmentId(id);
    setEditDialogOpen(true);
  };

  // Function to handle delete button click
  const handleDeleteClick = (id) => {
    // Implement your delete logic here, e.g., show confirmation dialog
    setSelectedDepartmentId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDepartmentById(selectedDepartmentId);
      await refetchDepartment(); // Refresh user list after deletion
      setDeleteDialogOpen(false);
    } catch (error) {
      message.error("Error deleting department:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }));
  };

  const handleConfirmEdit = async () => {
    try {
      await updateDepartmentById(selectedDepartmentId, selectedDepartment);
      await refetchDepartment(); // Refresh user list after update
      setEditDialogOpen(false);
    } catch (error) {
      message.error("Error updating department:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "department", headerName: "Department Name", width: 420 },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 200,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss a")}
        </span>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Date and Time Updated",
      width: 200,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss a")}
        </span>
      ),
    },
    // Edit and Delete buttons
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleEditClick(params.row._id)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
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
    const worksheet = XLSX.utils.json_to_sheet(department);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Department Data Sheets");
    XLSX.writeFile(workbook, "department_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="DEPARTMENT LIST"
        subtitle="List of Department of the Local Government Unit(LGU)"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#388E3C",
            color: "##e0e0e0",
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
        m="30px 0 0 0"
        height="75vh"
        width="79vw"
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
          rows={department || []} // Ensure rows is always an array
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this department?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelDelete}
            color="primary"
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            minHeight: "20vh",
            maxHeight: "30vh",
            minWidth: "80vh",
            maxWidth: "80vh",
          },
        }}
      >
        <DialogTitle id="form-dialog-title">Edit Department Name</DialogTitle>
        {/*=========================================Dialog field============================================================== */}
        <DialogContent>
          <TextField
            margin="dense"
            name="department"
            label="Department Name"
            type="text"
            fullWidth
            value={selectedDepartment.department || ""}
            onChange={handleEditInputChange}
            required
            error={!selectedDepartment.department}
            helperText={
              !selectedDepartment.department
                ? "Department Name is required"
                : ""
            }
          ></TextField>
        </DialogContent>

        {/*=========================================Dialog field============================================================== */}

        <DialogActions>
          <Button
            onClick={handleEditDialogClose}
            color="primary"
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEdit}
            color="error"
            disabled={updateLoading}
          >
            {updateLoading ? "Updating..." : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentList;
