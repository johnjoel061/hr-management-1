import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import useFetchAllSettings from "../../hooks/SettingsHook/useFetchAllSettings";

const AdminSettings = () => {
  const navigate = useNavigate();
  const {
    settings,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchAllSettings();

  if (fetchLoading) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError.message}</div>;
  }

  const handleEditClick = (id) => {
    navigate(`/settings/edit/${id}`); // Redirect to the edit page
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="SYSTEM SETTINGS"
          subtitle="Customize Local Government Unit (LGU) name and logo here."
        />
      </Box>

      <Box m="20px 0" width="90%">
        {settings.length === 0 ? (
          <Typography>No settings found.</Typography>
        ) : (
          <Grid  >
            {settings.map((setting) => (
              <Grid item xs={12} sm={6} md={4} key={setting._id}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      style={{ fontWeight: "bolder" }}
                    >
                      <bold>LGU NAME:</bold>{" "}
                      <span style={{ color: "#5ebea7" }}>
                        {setting.lguName}
                      </span>
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      gutterBottom
                      style={{ fontWeight: "bolder" }}
                    >
                      <bold>LGU Email:</bold> {setting.lguGmail}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardContent>
                    <Box
                      display="flex"
                      // flexDirection="column"
                      gap="20px"
                      alignItems="center"
                    >
                      <Box margin="20px 0">
                        <CardMedia
                          component="img"
                          image={setting.lguLogo}
                          alt="LGU Logo"
                          style={{
                            width: "300px",
                            height: "auto",
                            marginBottom: "10px",
                          }}
                        />
                        <bold style={{ fontWeight: "bolder" }}>LGU Logo</bold>
                      </Box>

                      <Box margin="20px 0">
                        <CardMedia
                          component="img"
                          image={setting.lguAuthLogo}
                          alt="LGU Auth Logo"
                          style={{
                            width: "300px",
                            height: "auto",
                            marginBottom: "10px",
                          }}
                        />
                        <bold style={{ fontWeight: "bolder" }}>LGU Authentication Logo</bold>
                      </Box>

                      <Box margin="20px 0">
                        <CardMedia
                          component="img"
                          image={setting.lguOrgStructure}
                          alt="LGU Org Structure"
                          style={{
                            width: "300px",
                            height: "auto",
                            marginBottom: "10px",
                          }}
                        />
                        <bold style={{ fontWeight: "bolder" }}>LGU Organizational Structure</bold>
                      </Box>
                    </Box>
                    <Button
                      onClick={() => handleEditClick(setting._id)}
                      variant="contained"
                      color="error"
                      style={{ marginTop: "10px" }}
                    >
                      Edit Settings
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AdminSettings;
