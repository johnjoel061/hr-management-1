import {
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import useFetchAllSettings from "../../hooks/SettingsHook/useFetchAllSettings";
import HRISLogo from "../../assets/images/hris-logo.png";

const Footer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    settings,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchAllSettings();

  return (
    <Box p={5} sx={{ backgroundColor: colors.blueAccent[700], marginTop: 5 }}>
      {/* LOGO LGU */}
      {fetchLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : fetchError ? (
        <Typography color="error">Error: {fetchError.message}</Typography>
      ) : (
        settings &&
        settings.length > 0 && (
          <Grid
            container
            justifyContent={isSmallScreen ? "center" : "space-between"}
            alignItems="center"
            direction={isSmallScreen ? "column" : "row"}
            spacing={isSmallScreen ? 2 : 0} 
          >
            <Grid item>
              <Box
                display="flex"
                justifyContent={isSmallScreen ? "center" : "flex-start"}
                alignItems="center"
              >
                <Link to="/">
                <img
                  alt="LGU Logo"
                  width="150px"
                  height="150px"
                  src={settings[0].lguLogo}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
                </Link>
              </Box>
            </Grid>

            <Grid item>
              <Box textAlign={isSmallScreen ? "center" : "center"}>
                <img
                  src={HRISLogo}
                  alt="HRIS logo"
                  style={{ height: "90px", width: "190px" }}
                />
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "Montserrat" }}
                  color="textSecondary"
                >
                  Copyright © 2024
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "Montserrat" }}
                  color="textSecondary"
                >
                  All Rights Reserved
                </Typography>
              </Box>
            </Grid>

            <Grid item>
              <Box textAlign={isSmallScreen ? "center" : "right"}>
                <Typography
                  variant="body2"
                  mb={1}
                  sx={{ fontFamily: "Montserrat", fontSize: "14px" }}
                  color="textSecondary"
                >
                  <Link
                    to="/employee-organizational-structure"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Organizational Structure
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  mb={1}
                  sx={{ fontFamily: "Montserrat", fontSize: "14px" }}
                  color="textSecondary"
                >
                  <Link
                    to="/employee-calendar-of-activities"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Calendar of Activities
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  mb={1}
                  sx={{ fontFamily: "Montserrat", fontSize: "14px" }}
                  color="textSecondary"
                >
                  <Link
                    to="/employee-privacy-policy"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  mb={1}
                  sx={{ fontFamily: "Montserrat", fontSize: "14px" }}
                  color="textSecondary"
                >
                  <Link
                    to="/employee-faqs"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    FAQs
                  </Link>
                </Typography>
              </Box>
            </Grid>

            <Grid item>
              <Box textAlign={isSmallScreen ? "center" : "right"}>
                <Typography
                  variant="body2"
                  mb={1}
                  sx={{
                    fontFamily: "Montserrat",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                  color="textSecondary"
                >
                  DEVELOPED BY
                </Typography>
                <p
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  John Joel C. Alfabete
                </p>
              </Box>
            </Grid>
          </Grid>
        )
      )}
    </Box>
  );
};

export default Footer;
