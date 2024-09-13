import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Upload } from "antd";
import { useAuth } from "../../../contexts/AuthContext";
import useUploadAvatar from "../../../hooks/UserHook/useUploadAvatar";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../../theme";
import LGULogo from "../../../assets/images/users/LGU-LOGO.jpg";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import useFetchAllSettings from "../../../hooks/SettingsHook/useFetchAllSettings";
import HRISLogo from "../../../assets/images/hris-logo.png";


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography sx={{ fontFamily: "Montserrat" }}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const MadSidebar = () => {
  const { userData, updateUserData } = useAuth();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const {
    settings,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchAllSettings();


  const { uploadAvatar, loading } = useUploadAvatar(
    userData._id,
    (newAvatarUrl) => setAvatarUrl(newAvatarUrl)
  );

  const [avatarUrl, setAvatarUrl] = useState(userData.avatar || "");

  // Update avatarUrl when userData changes
  useEffect(() => {
    if (userData) {
      setAvatarUrl(userData.avatar);
    }
  }, [userData]);

  const handleAvatarUpload = async (file) => {
    try {
      const data = await uploadAvatar(file);
      setAvatarUrl(data.avatarUrl); // Ensure to use the correct response structure

      // Update user data with the new avatar URL
      updateUserData({ ...userData, avatar: data.avatarUrl });
    } catch (error) {
      console.error(error.message);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleAvatarUpload(file);
      return false; // Prevent automatic upload
    },
  };

  return (
    <Box
      className="admin-sidebar"
      sx={{
        position: "sticky",
        top: "0",
        height: "100vh",
        overflowY: "auto",
        fontFamily: "Montserrat", // Set font to Montserrat
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 10px 5px 10px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 40px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box>
                <img
                  src={HRISLogo}
                  alt="HRIS logo"
                  style={{ height: "90px", width: "190px" }}
                />
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="20px">
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar src={avatarUrl} sx={{ width: 100, height: 100 }} />
                <Upload {...uploadProps} showUploadList={false}>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={loading}
                    sx={{ mt: 2, fontFamily: "Montserrat" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Change Profile"
                    )}
                  </Button>
                </Upload>
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "8px 0 0 0", fontFamily: "Montserrat" }}
                >
                  {userData.lastName}, {userData.firstName}
                </Typography>
                <Typography
                  variant="h6"
                  color={colors.greenAccent[500]}
                  sx={{ fontFamily: "Montserrat" }}
                >
                  {userData.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "8%"}>
            <Item
              title="Dashboard"
              to="/m-admin-dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* MANAGEMENT OF LEAVES */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              LEAVES
            </Typography>
            
            {/* ListAltOutlinedIcon */}
            <Item
              title="Leave List"
              to="/m-admin-leave-list"
              icon={<ListAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Pending"
              to="/m-admin-leave-pending"
              icon={<PendingActionsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Approved"
              to="/m-admin-leave-approved"
              icon={<AssignmentTurnedInOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Rejected"
              to="/m-admin-leave-rejected"
              icon={<DangerousOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            
            {/* LOGO LGU */}
            {fetchLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
              </Box>
            ) : fetchError ? (
              <Typography color="error">Error: {fetchError.message}</Typography>
            ) : (
              settings && settings.length > 0 && (
                <Box>
                  {!isCollapsed && (
                    <Box mb="20px" marginTop="50px">
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          alt="LGU Logo"
                          width="150px"
                          height="150px"
                          src={settings[0].lguLogo ||  LGULogo}
                          style={{ cursor: "pointer", borderRadius: "50%" }}
                        />
                      </Box>
                      <Box textAlign="center">
                        <Typography
                          variant="h5"
                          color={colors.grey[100]}
                          fontWeight="bold"
                          sx={{ m: "8px 0 0 0", fontFamily: "Montserrat" }}
                        >
                          {settings[0].lguName || "NAME"} LGU
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default MadSidebar;
