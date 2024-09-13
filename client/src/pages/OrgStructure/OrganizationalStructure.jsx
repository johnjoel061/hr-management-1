import { Card, Typography, Spin } from "antd";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid as MUIGrid,
} from "@mui/material";
import Header from "../../components/Header";
import styled from "styled-components";
import Footer from "../global/Footer";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useFetchOrgStructure from "../../hooks/OrgStructureHook/useFetchOrgStructure";
import useFetchAllSettings from "../../hooks/SettingsHook/useFetchAllSettings"; // Assuming this exists

const StyledCard = styled(Card)`
  margin: 0 100px;
  background: none;
  border: none;

  @media (max-width: 780px) {
    margin: 2px;
  }
`;

const Wrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding-bottom: 20px;  
`;

const ResponsiveImage = styled.img`
  max-width: 100%;
  height: auto;
  cursor: pointer;
`;

const OrganizationalStructure = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { orgStructure } = useFetchOrgStructure();

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const handleImageDialogClose = () => {
    setImageDialogOpen(false);
  };

  const {
    settings,
    loading: settingsFetchLoading,
    error: settingsFetchError,
  } = useFetchAllSettings();

  const columns = [
    {
      field: "orgTitle",
      headerName: "Organizational Structure Title",
      width: 550,
      flex: 1,
    },
    {
      field: "orgScannedPicture",
      headerName: "Organizational Structure Scanned Images",
      width: 350,
      flex: 1,
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
                      width: "100%",
                      height: "100px",
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
  ];

  return (
    <Wrapper>
      <Content>
        <StyledCard>
          <Header
            title="ORGANIZATIONAL STRUCTURES"
            subtitle="Organizational Structures of Local Government Unit (LGU)"
          />

          {/* LGU LOGO */}
          {settingsFetchLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin />
            </div>
          ) : settingsFetchError ? (
            <Typography type="danger">
              Error: {settingsFetchError.message}
            </Typography>
          ) : (
            settings &&
            settings.length > 0 && (
              <MUIGrid container justifyContent="center">
                <MUIGrid item xs={12} sm={10} md={8} lg={6}>
                  <ResponsiveImage
                    alt="org structure"
                    src={settings[0].lguOrgStructure}
                  />
                </MUIGrid>
              </MUIGrid>
            )
          )}

          <Box
            mt={4} // Reduce unnecessary height by using margin top instead of fixed height
            width="100%"
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
            <Header title="ORGANIZATIONAL STRUCTURES OF EVERY DEPARTMENT" />
            <DataGrid
              rows={orgStructure || []}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row._id}
              autoHeight 
              disableColumnMenu
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
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleImageDialogClose} color="error">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </StyledCard>
      </Content>
      <Footer />
    </Wrapper>
  );
};

export default OrganizationalStructure;
