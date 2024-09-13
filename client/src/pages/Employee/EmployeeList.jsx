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
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import useFetchUsers from "../../hooks/UserHook/useFetchUsers";
import useDeleteUserById from "../../hooks/UserHook/useDeleteUserById";
import useUpdateUser from "../../hooks/UserHook/useUpdateUser";
import useFetchDepartment from "../../hooks/DepartmentHook/useFetchDepartment";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { message } from "antd";

const EmployeeList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { users, refetchUsers } = useFetchUsers();
  const {
    department,
    loading: departmentLoading,
    error: departmentError,
  } = useFetchDepartment();
  const { deleteUserById, loading: deleteLoading } = useDeleteUserById();
  const { updateUser, loading: updateLoading } = useUpdateUser();
  
  const handleViewClick = (id) => {
    navigate(`/employee-list/employee-details/${id}`);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  
  // Function to handle edit button click
  const handleEditClick = (id) => {
    // Implement your edit logic here, e.g., navigate to edit page
    const user = users.find((user) => user._id === id);
    setSelectedUser(user);
    setSelectedUserId(id);
    setEditDialogOpen(true);
  };

  // Function to handle delete button click
  const handleDeleteClick = (id) => {
    // Implement your delete logic here, e.g., show confirmation dialog
    setSelectedUserId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserById(selectedUserId);
      await refetchUsers(); // Refresh user list after deletion
      setDeleteDialogOpen(false);
    } catch (error) {
      message.error("Error deleting user:", error);
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
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const formatDateFields = (user) => {
    const dateFields = [
      "dateOfBirth",
      "dateOfSeparation",
      "dateOfLastPromotion",
      "hiredDate",
      "firstDayOfService"
    ];

    dateFields.forEach((field) => {
      if (user[field]) {
        user[field] = format(new Date(user[field]), "MMMM d, yyyy");
      }
    });

    return user;
  };

  const handleConfirmEdit = async () => {
    try {
      const formattedUser = formatDateFields(selectedUser);

      await updateUser(selectedUserId, formattedUser);
      await refetchUsers(); // Refresh user list after update
      setEditDialogOpen(false);
    } catch (error) {
      message.error("Error updating user:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "employeeId", headerName: "Employee ID", width: 200 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "middleName", headerName: "Middle Name", width: 200 },
    { field: "suffix", headerName: "Suffix", width: 200 },
    { field: "dateOfBirth", headerName: "dateOfBirth", width: 200 },
    { field: "gender", headerName: "Gender", width: 200 },
    { field: "civilStatus", headerName: "Civil Status", width: 200 },
    {
      field: "causeOfSeparation",
      headerName: "Cause of Separation",
      width: 200,
    },
    { field: "dateOfSeparation", headerName: "Date of Separation", width: 200 },
    { field: "officeAssignment", headerName: "Office Assignment", width: 200 },
    { field: "reAssignment", headerName: "Reassignment", width: 200 },
    { field: "positionTitle", headerName: "Position Title/Job", width: 200 },
    { field: "salaryGrade", headerName: "Salary Grade", width: 200 },
    { field: "salary", headerName: "Salary", width: 200 },
    { field: "stepIncrement", headerName: "Step Increment", width: 200 },
    { field: "hiredDate", headerName: "Hired Date", width: 200 },
    { field: "firstDayOfService", headerName: "First Day of Service", width: 200 },
    { field: "employmentStatus", headerName: "Employment Status", width: 200 },
    {
      field: "dateOfLastPromotion",
      headerName: "Date of Last Promotion",
      width: 200,
    },
    { field: "positionLevel", headerName: "Position Level", width: 200 },
    {
      field: "statusOfCurrentEmployment",
      headerName: "Status of Current Employment",
      width: 250,
    },

    { field: "dateOfBirth", headerName: "Date of Birth", width: 200 },
    { field: "tin", headerName: "TIN", width: 200 },
    { field: "gsis", headerName: "GSIS", width: 200 },
    { field: "pagIbig", headerName: "PAG-IBIG", width: 200 },
    { field: "philHealth", headerName: "PhilHealth", width: 200 },
    { field: "bloodType", headerName: "Blood Type", width: 120 },
    //emergencyContactName
    {
      field: "emergencyContactName",
      headerName: "Emergency Contact Name",
      width: 220,
    },
    {
      field: "emergencyContact",
      headerName: "Emergency Contact Number",
      width: 220,
    },
    { field: "contactNumber", headerName: "Contact Number", width: 200 },

    //------------------------------------------------
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "educationalBackground",
      headerName: "Educational Background",
      width: 230,
    },
    {
      field: "employeeEligibilities",
      headerName: "Eligibility/ies",
      width: 200,
    },
    {
      field: "reportTo",
      headerName: "Reports To",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 210,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Date and Time Updated",
      width: 210,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
      ),
    },

    // Edit and Delete buttons
    {
      field: "actions",
      headerName: "Actions",
      width: 235,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 8, backgroundColor: '#4d55b3' }}
            onClick={() => handleViewClick(params.row._id)}
            // Once I click this button it will go to the employee details page and can view the employee information
          >
            View
          </Button>
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
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users Data Sheets");
    XLSX.writeFile(workbook, "users_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="EMPLOYEE LIST"
        subtitle="List of Employees of the Local Government Unit(LGU)"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box/>
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
          rows={users || []} // Ensure rows is always an array
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
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
      >
        <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
        {/*=========================================Dialog field============================================================== */}

        <DialogContent>
          <TextField
            margin="dense"
            name="employeeId"
            label="Employee ID"
            type="text"
            fullWidth
            value={selectedUser.employeeId || ""}
            onChange={handleEditInputChange}
            required
            error={!selectedUser.employeeId}
            helperText={
              !selectedUser.employeeId ? "Employee ID is required" : ""
            }
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            value={selectedUser.lastName || ""}
            onChange={handleEditInputChange}
            required
            error={!selectedUser.lastName}
            helperText={!selectedUser.lastName ? "Last Name is required" : ""}
          />
          <TextField
            margin="dense"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            value={selectedUser.firstName || ""}
            onChange={handleEditInputChange}
            required
            error={!selectedUser.firstName}
            helperText={!selectedUser.firstName ? "First Name is required" : ""}
          />
          <TextField
            margin="dense"
            name="middleName"
            label="Middle Name"
            type="text"
            fullWidth
            value={selectedUser.middleName || ""}
            onChange={handleEditInputChange}
            required
            error={!selectedUser.middleName}
            helperText={
              !selectedUser.middleName ? "Middle Name is required" : ""
            }
          />
          <TextField
            margin="dense"
            name="suffix"
            label="Suffix"
            type="text"
            fullWidth
            value={selectedUser.suffix || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            fullWidth
            value={selectedUser.dateOfBirth || ""}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            margin="dense"
            name="gender"
            label="Sex"
            fullWidth
            value={selectedUser.gender || "Male"}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </TextField>

          <TextField
            select
            margin="dense"
            name="civilStatus"
            label="Civil Status"
            fullWidth
            value={selectedUser.civilStatus || "Single"}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Annulled">Annulled</option>
            <option value="Widowed">Widowed</option>
            <option value="Legally Separated">Legally Separated</option>
            <option value="Divorced">Divorced</option>
          </TextField>
          <TextField
            margin="dense"
            name="dateOfSeparation"
            label="Date of Separation"
            type="date"
            fullWidth
            value={selectedUser.dateOfSeparation || ""}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="causeOfSeparation"
            label="Cause of Separation"
            type="text"
            fullWidth
            value={selectedUser.causeOfSeparation || ""}
            onChange={handleEditInputChange}
          />

          <TextField
            select
            margin="dense"
            name="officeAssignment"
            label="Office Assignment"
            type="text"
            fullWidth
            value={selectedUser.officeAssignment || ""}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            {!departmentLoading &&
              !departmentError &&
              department.map((dept) => (
                <option key={dept._id} value={dept.department}>
                  {dept.department}
                </option>
              ))}
            ;
          </TextField>

          <TextField
            select
            margin="dense"
            name="reAssignment"
            label="Reassignment"
            type="text"
            fullWidth
            value={selectedUser.reAssignment || "NONE"}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            <option value="NONE">NONE</option>
            {!departmentLoading &&
              !departmentError &&
              department.map((dept) => (
                <option key={dept._id} value={dept.department}>
                  {dept.department}
                </option>
              ))}
            ;
          </TextField>

          <TextField
            margin="dense"
            name="positionTitle"
            label="Position Title/Job"
            type="text"
            fullWidth
            value={selectedUser.positionTitle || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="salaryGrade"
            label="Salary Grade"
            type="text"
            fullWidth
            value={selectedUser.salaryGrade || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="salary"
            label="Salary"
            type="text"
            fullWidth
            value={selectedUser.salary || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="stepIncrement"
            label="Step Increment"
            type="text"
            fullWidth
            value={selectedUser.stepIncrement || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="hiredDate"
            label="Hired Date"
            type="date"
            fullWidth
            value={selectedUser.hiredDate || ""}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="firstDayOfService"
            label="First Day of Service"
            type="date"
            fullWidth
            value={selectedUser.firstDayOfService || ""}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            margin="dense"
            name="employmentStatus"
            label="Employment Status"
            fullWidth
            value={selectedUser.employmentStatus || "ACTIVE"}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </TextField>
          <TextField
            margin="dense"
            name="dateOfLastPromotion"
            label="Date of Last Promotion"
            type="date"
            fullWidth
            value={selectedUser.dateOfLastPromotion || ""}
            onChange={handleEditInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="positionLevel"
            label="Position Level"
            type="text"
            fullWidth
            value={selectedUser.positionLevel || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="statusOfCurrentEmployment"
            label="Status of Current Employment"
            type="text"
            fullWidth
            value={selectedUser.statusOfCurrentEmployment || ""}
            onChange={handleEditInputChange}
          />

          <TextField
            margin="dense"
            name="tin"
            label="TIN"
            type="text"
            fullWidth
            value={selectedUser.tin || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="gsis"
            label="GSIS"
            type="text"
            fullWidth
            value={selectedUser.gsis || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="pagIbig"
            label="PAG-IBIG"
            type="text"
            fullWidth
            value={selectedUser.pagIbig || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="philHealth"
            label="PhilHealth"
            type="text"
            fullWidth
            value={selectedUser.philHealth || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            select
            margin="dense"
            name="bloodType"
            label="Blood Type"
            fullWidth
            value={selectedUser.bloodType || "Type O"}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </TextField>
          <TextField
            margin="dense"
            name="emergencyContactName"
            label="Emergency Contact Name"
            type="text"
            fullWidth
            value={selectedUser.emergencyContactName || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="emergencyContact"
            label="Emergency Contact Number"
            type="text"
            fullWidth
            value={selectedUser.emergencyContact || ""}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            name="contactNumber"
            label="Contact Number"
            type="text"
            fullWidth
            value={selectedUser.contactNumber || ""}
            onChange={handleEditInputChange}
          />

          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={selectedUser.email || ""}
            onChange={handleEditInputChange}
            required
          />

          <TextField
            select
            margin="dense"
            name="role"
            label="Role"
            fullWidth
            value={selectedUser.role || "EMPLOYEE"}
            onChange={handleEditInputChange}
            SelectProps={{ native: true }}
          >
            <option value="M-ADMIN">M-ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="HOD">HOD</option>
            <option value="EMPLOYEE">EMPLOYEE</option>
          </TextField>

          <TextField
            margin="dense"
            name="educationalBackground"
            label="Educational Background"
            type="text"
            fullWidth
            value={selectedUser.educationalBackground || ""}
            onChange={handleEditInputChange}
          />

          <TextField
            margin="dense"
            name="reportTo"
            label="Reports To"
            type="text"
            fullWidth
            value={selectedUser.reportTo || ""}
            onChange={handleEditInputChange}
          />

          <TextField
            name="employeeEligibilities"
            label="Eligibility/ies"
            fullWidth
            multiline
            rows={4}
            value={selectedUser.employeeEligibilities || ""}
            onChange={handleEditInputChange}
            margin="normal"
          />
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

export default EmployeeList;
