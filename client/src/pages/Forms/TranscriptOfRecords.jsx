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
import useFetchTor from "../../hooks/FormsHook/TorHook/useFetchTor";
import useDeleteTor from "../../hooks/FormsHook/TorHook/useDeleteTor";
import useUpdateTor from "../../hooks/FormsHook/TorHook/useUpdateTor";
import useAddTor from "../../hooks/FormsHook/TorHook/useAddTor";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const TranscriptOfRecords = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { tor, refetchTor } =
  useFetchTor();
  const { deleteTorById, loading: deleteLoading } =
  useDeleteTor();
  const { updateTorById, loading: updateLoading } =
  useUpdateTor();
  const {
    addTor,
    loading: addLoading,
    error: addError,
  } = useAddTor();

  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedTorId, setSelectedTorId] =
    useState(null);
  const [selectedTor, setSelectedTor] = useState(
    {}
  );
  const [newTor, setNewTor] = useState({
    torLastName: "",
    torFirstName: "",
    torMiddleName: "",
    torSuffix: "NONE",
    torScannedPicture: [],
  });

  const [selectedImage, setSelectedImage] = useState("");
  
  const handleEditClick = (id) => {
    const torToEdit = tor.find(
      (item) => item._id === id
    );
    setSelectedTor(torToEdit);
    setSelectedTorId(id);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedTorId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTorById(selectedTorId);
      await refetchTor();
      setDeleteDialogOpen(false);
    } catch (error) {
      message.error("Error deleting TOR:", error);
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
    setSelectedTor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentFileCount = newTor.torScannedPicture.length;

    // Check if adding new files would exceed the limit
    if (currentFileCount + files.length > 10) {
      message.error("You can only upload up to 10 images.");
      return;
    }
    setNewTor((prev) => ({
      ...prev,
      torScannedPicture: [...prev.torScannedPicture, ...files],
    }));
  };

  const handleRemoveFile = (fileName) => {
    setNewTor((prev) => ({
      ...prev,
      torScannedPicture: prev.torScannedPicture.filter(
        (file) => file.name !== fileName
      ),
    }));
  };


  const handleConfirmEdit = async () => {
    const { newTorScannedPicture, ...restData } = selectedTor;
    try {
      await updateTorById(
        selectedTorId,
        restData,
        newTorScannedPicture
      );
      await refetchTor();
      setEditDialogOpen(false);
    } catch (error) {
      message.error("Error updating TOR:", error);
    }
  };

  const handleConfirmAdd = async () => {
    if (
      !newTor.torLastName ||
      !newTor.torFirstName ||
      !newTor.torMiddleName ||
      !newTor.torSuffix ||
      !newTor.torScannedPicture
    ) {
      message.error("Please fill in all required fields.");
      return;
    }

    try {
      await addTor(newTor);
      await refetchTor();
      setAddDialogOpen(false);
      setNewTor({
        torLastName: "",
        torFirstName: "",
        torMiddleName: "",
        torSuffix: "NONE",
        torScannedPicture: [],
      });
    } catch (error) {
      message.error("Error adding TOR:", error);
    }
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "torLastName", headerName: "Last Name", width: 180 },
    { field: "torFirstName", headerName: "First Name", width: 180 },
    { field: "torMiddleName", headerName: "Middle Name", width: 180 },
    { field: "torSuffix", headerName: "Suffix", width: 120 },
    {
      field: "torScannedPicture",
      headerName: "TOR Scanned Images",
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
    const worksheet = XLSX.utils.json_to_sheet(tor);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TOR Data Sheets");
    XLSX.writeFile(workbook, "tor_data_sheets.xlsx");
  };

  
  return (
    <Box m="20px">
      <Header
        title="TRANSCRIPT OF RECORDS LIST"
        subtitle="List of Transcript of Records/Diplomas of the Local Government Unit (LGU)"
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
            <Box ml={1}>Add New TOR</Box>
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
          rows={tor || []}
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
            Are you sure you want to delete this TOR?
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
        <DialogTitle>Edit TOR Info</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Last Name"
            name="torLastName"
            value={selectedTor.torLastName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="First Name"
            name="torFirstName"
            value={selectedTor.torFirstName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Middle Name"
            name="torMiddleName"
            value={selectedTor.torMiddleName}
            onChange={handleEditInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Suffix"
            name="torSuffix"
            value={selectedTor.torSuffix}
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
        <DialogTitle>Add New TOR</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Last Name"
            name="torLastName"
            value={newTor.torLastName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="First Name"
            name="torFirstName"
            value={newTor.torFirstName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Middle Name"
            name="torMiddleName"
            value={newTor.torMiddleName}
            onChange={handleAddInputChange}
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Suffix"
            name="torSuffix"
            value={newTor.torSuffix}
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
          {newTor.torScannedPicture.length > 0 && (
            <Box mt={2}>
              <strong>Selected files:</strong>
              <ol>
                {newTor.torScannedPicture.map((file, index) => (
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

export default TranscriptOfRecords;
