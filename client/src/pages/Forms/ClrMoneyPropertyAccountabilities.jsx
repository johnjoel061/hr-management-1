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
import { message } from "antd";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import useFetchClearanceMoneyPropertyAcct from "../../hooks/FormsHook/ClearanceMoneyPropertyAcctHook/useFetchClearanceMoneyPropertyAcct";
import useDeleteClearanceMoneyPropertyAcctHook from "../../hooks/FormsHook/ClearanceMoneyPropertyAcctHook/useDeleteClearanceMoneyPropertyAcctHook";
import useUpdateClearanceMoneyPropertyAcct from "../../hooks/FormsHook/ClearanceMoneyPropertyAcctHook/useUpdateClearanceMoneyPropertyAcct";
import useAddClearanceMoneyPropertyAcct from "../../hooks/FormsHook/ClearanceMoneyPropertyAcctHook/useAddClearanceMoneyPropertyAcct";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const ClrMoneyPropertyAccountabilities = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { clearanceMoneyPropertyAcct, refetchClearanceMoneyPropertyAcct } =
  useFetchClearanceMoneyPropertyAcct();
  const { deleteClearanceMoneyPropertyAcctById, loading: deleteLoading } =
  useDeleteClearanceMoneyPropertyAcctHook();
  const { updateClearanceMoneyPropertyAcctById, loading: updateLoading } =
  useUpdateClearanceMoneyPropertyAcct();
  const {
    addClearanceMoneyPropertyAcct,
    loading: addLoading,
    error: addError,
  } = useAddClearanceMoneyPropertyAcct();

  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedClearanceMoneyPropertyAcctId, setSelectedClearanceMoneyPropertyAcctId] =
    useState(null);
  const [selectedClearanceMoneyPropertyAcct, setSelectedClearanceMoneyPropertyAcct] = useState(
    {}
  );
  const [newClearanceMoneyPropertyAcct, setNewClearanceMoneyPropertyAcct] = useState({
    cleLastName: "",
    cleFirstName: "",
    cleMiddleName: "",
    cleSuffix: "NONE",
    cleScannedPicture: [],
  });

  const [selectedImage, setSelectedImage] = useState("");
  
  const handleEditClick = (id) => {
    const clearanceMoneyPropertyAcctToEdit = clearanceMoneyPropertyAcct.find(
      (item) => item._id === id
    );
    setSelectedClearanceMoneyPropertyAcct(clearanceMoneyPropertyAcctToEdit);
    setSelectedClearanceMoneyPropertyAcctId(id);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedClearanceMoneyPropertyAcctId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteClearanceMoneyPropertyAcctById(selectedClearanceMoneyPropertyAcctId);
      await refetchClearanceMoneyPropertyAcct();
      setDeleteDialogOpen(false);
    } catch (error) {
      message.error("Error deleting Clearance from Money and Property Accountabilities:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedClearanceMoneyPropertyAcct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewClearanceMoneyPropertyAcct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentFileCount = newClearanceMoneyPropertyAcct.cleScannedPicture.length;

    // Check if adding new files would exceed the limit
    if (currentFileCount + files.length > 10) {
      message.error("You can only upload up to 10 images.");
      return;
    }
    setNewClearanceMoneyPropertyAcct((prev) => ({
      ...prev,
      cleScannedPicture: [...prev.cleScannedPicture, ...files],
    }));
  };

  const handleRemoveFile = (fileName) => {
    setNewClearanceMoneyPropertyAcct((prev) => ({
      ...prev,
      cleScannedPicture: prev.cleScannedPicture.filter(
        (file) => file.name !== fileName
      ),
    }));
  };


  const handleConfirmEdit = async () => {
    const { newCleScannedPicture, ...restData } = selectedClearanceMoneyPropertyAcct;
    try {
      await updateClearanceMoneyPropertyAcctById(
        selectedClearanceMoneyPropertyAcctId,
        restData,
        newCleScannedPicture
      );
      await refetchClearanceMoneyPropertyAcct();
      setEditDialogOpen(false);
    } catch (error) {
      message.error("Error updating Clearance from Money and Property Accountabilities:", error);
    }
  };

  const handleConfirmAdd = async () => {
    if (
      !newClearanceMoneyPropertyAcct.cleLastName ||
      !newClearanceMoneyPropertyAcct.cleFirstName ||
      !newClearanceMoneyPropertyAcct.cleMiddleName ||
      !newClearanceMoneyPropertyAcct.cleSuffix ||
      !newClearanceMoneyPropertyAcct.cleScannedPicture
    ) {
      message.error("Please fill in all required fields.");
      return;
    }

    try {
      await addClearanceMoneyPropertyAcct(newClearanceMoneyPropertyAcct);
      await refetchClearanceMoneyPropertyAcct();
      setAddDialogOpen(false);
      setNewClearanceMoneyPropertyAcct({
        cleLastName: "",
        cleFirstName: "",
        cleMiddleName: "",
        cleSuffix: "NONE",
        cleScannedPicture: [],
      });
    } catch (error) {
      message.error("Error adding Clearance from Money and Property Accountabilities:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "cleLastName", headerName: "Last Name", width: 180 },
    { field: "cleFirstName", headerName: "First Name", width: 180 },
    { field: "cleMiddleName", headerName: "Middle Name", width: 180 },
    { field: "cleSuffix", headerName: "Suffix", width: 120 },
    {
      field: "cleScannedPicture",
      headerName: "Clearance from Money and Property Accountabilities Scanned Images",
      width: 350,
      renderCell: (params) => (
        <Box>
          {params.value && params.value.length > 0 ? (
            <Box display="flex" flexWrap="wrap">
              {params.value.map((url, index) => (
                <Box key={index} mb={1} mr={1}>
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedImage(url);
                      setImageDialogOpen(true);
                    }}
                  />
                </Box>
              ))}
            </Box>
          ) : (
            <span>No Image</span>
          )}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy - h:mm:ss a")}</span>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Date and Time Updated",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy - h:mm:ss a")}</span>
      ),
    },
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
    const worksheet = XLSX.utils.json_to_sheet(clearanceMoneyPropertyAcct);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "clrMonPropAcct Data Sheets");
    XLSX.writeFile(workbook, "clrMoneyPropertyAcct_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="CLEARANCE FROM MONEY AND PROPERTY ACCOUNTABILITIES LIST"
        subtitle="List of Clearance from Money and Property Accountabilities of the Local Government Unit (LGU)"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <Button
          variant="contained"
          color="error"
          onClick={() => setAddDialogOpen(true)}
          style={{ margin: "0 20px" }}
        >
          <Box display="flex" alignItems="center">
            <AddCircleOutlineOutlinedIcon />
            <Box ml={1}>Add New CLEARANCE</Box>
          </Box>
        </Button>

        <Button
          variant="contained"
            sx={{
              backgroundColor: '#388E3C', 
              color: '##e0e0e0', 
              margin: '0 20px',
              '&:hover': {
                backgroundColor: '#45A049', 
              }
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
          rows={clearanceMoneyPropertyAcct || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog
        open={imageDialogOpen}
        onClose={handleImageDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>View Image</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <img
              src={selectedImage}
              alt="Selected"
              style={{ maxWidth: "100%" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose} color="error">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Clearance?
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

      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            minHeight: "55vh",
            maxHeight: "55vh",
            minWidth: "80vh",
            maxWidth: "80vh",
          },
        }}
      >
        <DialogTitle>Edit Clearance Info</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Last Name"
            name="cleLastName"
            value={selectedClearanceMoneyPropertyAcct.cleLastName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="First Name"
            name="cleFirstName"
            value={selectedClearanceMoneyPropertyAcct.cleFirstName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Middle Name"
            name="cleMiddleName"
            value={selectedClearanceMoneyPropertyAcct.cleMiddleName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Suffix"
            name="cleSuffix"
            value={selectedClearanceMoneyPropertyAcct.cleSuffix}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
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

      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            minHeight: "70vh",
            maxHeight: "70vh",
            minWidth: "80vh",
            maxWidth: "80vh",
          },
        }}
      >
        <DialogTitle>Add New Clearance</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Last Name"
            name="cleLastName"
            value={newClearanceMoneyPropertyAcct.cleLastName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="First Name"
            name="cleFirstName"
            value={newClearanceMoneyPropertyAcct.cleFirstName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Middle Name"
            name="cleMiddleName"
            value={newClearanceMoneyPropertyAcct.cleMiddleName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Suffix"
            name="cleSuffix"
            value={newClearanceMoneyPropertyAcct.cleSuffix}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />

          {/* Dynamically add more file inputs */}
          <input
            type="file"
            multiple
            onChange={handleAddFileChange}
            style={{
              padding: "12px",
              border: `1px solid #606060`,
              borderRadius: "4px",
              fontSize: "0.8rem",
              backgroundColor: "",
              color: `${colors.primary}`,
              cursor: "pointer",
              margin: "10px 0",
            }}
          />
          {newClearanceMoneyPropertyAcct.cleScannedPicture.length > 0 && (
            <Box mt={2}>
              <strong>Selected files:</strong>
              <ol>
                {newClearanceMoneyPropertyAcct.cleScannedPicture.map((file, index) => (
                  <li key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        marginRight: 10,
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveFile(file.name)}
                      size="small"
                      style={{ marginLeft: 8 }}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ol>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddDialogClose}
            color="primary"
            disabled={addLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAdd}
            color="error"
            disabled={addLoading}
          >
            {addLoading ? "Adding..." : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClrMoneyPropertyAccountabilities;
