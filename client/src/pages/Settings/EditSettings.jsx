import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Input,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useFetchSettingsById from "../../hooks/SettingsHook/useFetchSettingsById";
import useUpdateSettings from "../../hooks/SettingsHook/useUpdateSettings";
import Header from "../../components/Header";
import { message } from "antd";

const EditSettings = () => {
  const { id } = useParams(); // Get the ID from URL params
  const {
    settings,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchSettingsById(id);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const {
    updateSettings,
    isLoading: updateLoading,
    error: updateError,
  } = useUpdateSettings();

  useEffect(() => {
    if (settings) {
      setFormData({
        lguName: settings.lguName || "",
        lguGmail: settings.lguGmail || "",
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({
      ...files,
      [name]: selectedFiles[0], // Assuming single file upload
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(id, formData, files);
      // Handle success, e.g., redirect or show success message
    } catch (error) {
      message.error("Error updating settings:", error);
    }
  };

  if (fetchLoading) {
    return <CircularProgress />;
  }

  if (fetchError) {
    return <div>Error: {fetchError.message}</div>;
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="EDIT SYSTEM SETTINGS"
          subtitle="Customize Local Government Unit (LGU) name and logo here!"
        />
      </Box>

      <Box m="30px 0" width="50vw">
        <form onSubmit={handleSubmit}>
          <TextField
            label="LGU Name"
            name="lguName"
            value={formData.lguName || ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
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
          <TextField
            label="LGU Gmail"
            name="lguGmail"
            value={formData.lguGmail || ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            margin="normal"
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

          <Box sx={{ margin: "10px 0" }}>
            <Typography>LGU logo</Typography>
            <Input
              type="file"
              name="lguLogo"
              onChange={handleFileChange}
              fullWidth
              margin="normal"
              style={{
                padding: "12px",
                border: "1px solid #9b9ea6",
                borderRadius: "4px",
                fontSize: "0.8rem",
                backgroundColor: "",
                color: ``,
                cursor: "pointer",
                margin: "10px 0",
              }}
            />
          </Box>

          <Box sx={{ margin: "10px 0" }}>
            <Typography>LGU Authentication Logo</Typography>
            <Input
              type="file"
              name="lguAuthLogo"
              onChange={handleFileChange}
              fullWidth
              margin="normal"
              style={{
                padding: "12px",
                border: "1px solid #9b9ea6",
                borderRadius: "4px",
                fontSize: "0.8rem",
                backgroundColor: "",
                color: ``,
                cursor: "pointer",
                margin: "10px 0",
              }}
            />
          </Box>

          <Box sx={{ margin: "10px 0" }}>
            <Typography>LGU Organizational Structure</Typography>
            <Input
              type="file"
              name="lguOrgStructure"
              onChange={handleFileChange}
              fullWidth
              margin="normal"
              style={{
                padding: "12px",
                border: "1px solid #9b9ea6",
                borderRadius: "4px",
                fontSize: "0.8rem",
                backgroundColor: "",
                color: ``,
                cursor: "pointer",
                margin: "10px 0",
              }}
            />
          </Box>

          <Box>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={updateLoading}
              style={{ margin: "20px 0" }}
              sx={{
                margin: "0 20px",
              }}
            >
              {updateLoading ? (
                <CircularProgress size={24} />
              ) : (
                "Update Settings"
              )}
            </Button>
          </Box>
          {updateError && (
            <Typography color="error">Error: {updateError.message}</Typography>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default EditSettings;
