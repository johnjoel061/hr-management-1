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
import useFetchDesignation from "../../hooks/FormsHook/DesignationHook/useFetchDesignation";
import useDeleteDesignation from "../../hooks/FormsHook/DesignationHook/useDeleteDesignation";
import useUpdateDesignation from "../../hooks/FormsHook/DesignationHook/useUpdateDesignation";
import useAddDesignation from "../../hooks/FormsHook/DesignationHook/useAddDesignation";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Designation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { designation, refetchDesignation } =
  useFetchDesignation();
  const { deleteDesignationById, loading: deleteLoading } =
  useDeleteDesignation();
  const { updateDesignationById, loading: updateLoading } =
  useUpdateDesignation();
  const {
    addDesignation,
    loading: addLoading,
    error: addError,
  } = useAddDesignation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const [selectedDesignationId, setSelectedDesignationId] =
    useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(
    {}
  );
  const [newDesignation, setNewDesignation] = useState({
    desLastName: "",
    desFirstName: "",
    desMiddleName: "",
    desSuffix: "NONE",
    desScannedPicture: [],
  });

  const [selectedImage, setSelectedImage] = useState("");
  
  const handleEditClick = (id) => {
    const designationToEdit = designation.find(
      (item) => item._id === id
    );
    setSelectedDesignation(designationToEdit);
    setSelectedDesignationId(id);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedDesignationId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDesignationById(selectedDesignationId);
      await refetchDesignation();
      setDeleteDialogOpen(false);
    } catch (error) {
      message.error("Error deleting Designation:", error);
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
    setSelectedDesignation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewDesignation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentFileCount = newDesignation.desScannedPicture.length;

    // Check if adding new files would exceed the limit
    if (currentFileCount + files.length > 10) {
      message.error("You can only upload up to 10 images.");
      return;
    }
    setNewDesignation((prev) => ({
      ...prev,
      desScannedPicture: [...prev.desScannedPicture, ...files],
    }));
  };

  const handleRemoveFile = (fileName) => {
    setNewDesignation((prev) => ({
      ...prev,
      desScannedPicture: prev.desScannedPicture.filter(
        (file) => file.name !== fileName
      ),
    }));
  };


  const handleConfirmEdit = async () => {
    const { newDesScannedPicture, ...restData } = selectedDesignation;
    try {
      await updateDesignationById(
        selectedDesignationId,
        restData,
        newDesScannedPicture
      );
      await refetchDesignation();
      setEditDialogOpen(false);
    } catch (error) {
      message.error("Error updating Designation:", error);
    }
  };

  const handleConfirmAdd = async () => {
    if (
      !newDesignation.desLastName ||
      !newDesignation.desFirstName ||
      !newDesignation.desMiddleName ||
      !newDesignation.desSuffix ||
      !newDesignation.desScannedPicture
    ) {
      message.error("Please fill in all required fields.");
      return;
    }

    try {
      await addDesignation(newDesignation);
      await refetchDesignation();
      setAddDialogOpen(false);
      setNewDesignation({
        desLastName: "",
        desFirstName: "",
        desMiddleName: "",
        desSuffix: "NONE",
        desScannedPicture: [],
      });
    } catch (error) {
      message.error("Error adding Designation:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "desLastName", headerName: "Last Name", width: 180 },
    { field: "desFirstName", headerName: "First Name", width: 180 },
    { field: "desMiddleName", headerName: "Middle Name", width: 180 },
    { field: "desSuffix", headerName: "Suffix", width: 120 },
    {
      field: "desScannedPicture",
      headerName: "Designation Scanned Images",
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
    const worksheet = XLSX.utils.json_to_sheet(designation);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Designation Data Sheets");
    XLSX.writeFile(workbook, "designation_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="DESIGNATION LIST"
        subtitle="List of Designation of the Local Government Unit (LGU)"
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
            <Box ml={1}>Add New DESIGNATION</Box>
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
          rows={designation || []}
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
            Are you sure you want to delete this Designation?
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
        <DialogTitle>Edit Designation Info</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Last Name"
            name="desLastName"
            value={selectedDesignation.desLastName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="First Name"
            name="desFirstName"
            value={selectedDesignation.desFirstName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Middle Name"
            name="desMiddleName"
            value={selectedDesignation.desMiddleName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Suffix"
            name="desSuffix"
            value={selectedDesignation.desSuffix}
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
        <DialogTitle>Add New Designation</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Last Name"
            name="desLastName"
            value={newDesignation.desLastName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="First Name"
            name="desFirstName"
            value={newDesignation.desFirstName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Middle Name"
            name="desMiddleName"
            value={newDesignation.desMiddleName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Suffix"
            name="desSuffix"
            value={newDesignation.desSuffix}
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
          {newDesignation.desScannedPicture.length > 0 && (
            <Box mt={2}>
              <strong>Selected files:</strong>
              <ol>
                {newDesignation.desScannedPicture.map((file, index) => (
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

export default Designation;
