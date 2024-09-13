import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
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
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import BallotOutlinedIcon from "@mui/icons-material/BallotOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
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

const AdminSidebar = () => {
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
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* MANAGEMENT OF EMPLOYEE */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              EMPLOYEE
            </Typography>
            <Item
              title="Add Employee"
              to="/add-employee"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Employee List"
              to="/employee-list"
              icon={<BallotOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* MANAGEMENT OF EMPLOYEE */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              ELIGIBILITY/IES
            </Typography>
            <Item
              title="New Eligibility"
              to="/add-eligibility"
              icon={<DescriptionOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Eligibility List"
              to="/eligibility-list"
              icon={<ViewListOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* MANAGEMENT OF DEPARTMENT */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              DEPARTMENT
            </Typography>
            <Item
              title="New Department"
              to="/new-department"
              icon={<BusinessOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Department List"
              to="/department-list"
              icon={<DnsOutlinedIcon />}
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
            <Item
              title="Leave Type"
              to="/add-leave-type"
              icon={<NoteAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Type List"
              to="/leave-type-list"
              icon={<SummarizeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* ListAltOutlinedIcon */}
            <Item
              title="Leave List"
              to="/leave-list"
              icon={<ListAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Pending"
              to="/leave-pending"
              icon={<PendingActionsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Approved"
              to="/leave-approved"
              icon={<AssignmentTurnedInOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Leave Rejected"
              to="/leave-rejected"
              icon={<DangerousOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* MANAGEMENT OF PAGES */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              Pages
            </Typography>
            <Item
              title="Organizational Structure"
              to="/organizational-structure"
              icon={<GroupsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faqs"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Privacy Policy"
              to="/privacy-policy"
              icon={<VerifiedUserOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Settings"
              to="/settings"
              icon={<SettingsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* REQUESTED FORMSSSSSSS */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              REQUEST FORMS
            </Typography>
            <Item
              title="Requested Forms"
              to="/requested-forms"
              icon={<PendingActionsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Request Approved"
              to="/request-approved"
              icon={<AssignmentTurnedInOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Request Rejected"
              to="/request-rejected"
              icon={<DangerousOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* FORMSSSSSSS */}
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Montserrat" }}
            >
              FORMS
            </Typography>
            {/* FORMS Dropdown */}
            <SubMenu
              title="List of Forms"
              icon={<InsertDriveFileOutlinedIcon />}
              className="submenu"
            >
              <MenuItem>
                <Link to="/forms-appointment">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Appointment
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-assumption-of-duty">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Assumption of Duty
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-oath-of-office">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Oath of Office
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-personal-data-sheet">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Personal Data Sheet (PDS)
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-position-description">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Position Description Form
                    <br />
                    (PDF)
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-certificate-of-eligibility">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Certificate of Eligibility
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-designation">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Designation
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-saln">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    SALN
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-nosi-nosa">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    NOSI/NOSA
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-medical-certificate">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Medical Certificate
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-nbi-clearance">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    NBI Clearance
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-transcript-of-records">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Transcript of Records/
                    <br />
                    Diploma
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-marriage-contract">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Marriage Contract
                  </Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/forms-birth-certificate">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Birth Certificate
                  </Typography>
                </Link>
              </MenuItem>{" "}
              <MenuItem>
                <Link to="/forms-certification-of-leave-balances">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Certification of Leave
                    <br />
                    Balances
                  </Typography>
                </Link>
              </MenuItem>{" "}
              <MenuItem>
                <Link to="/forms-clearance-from-money-and-property-accountabilities">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Clearance from Money &<br />
                    Property Accountabilities
                  </Typography>
                </Link>
              </MenuItem>{" "}
              <MenuItem>
                <Link to="/forms-commendations-and-awards">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Commendations and
                    <br /> Awards
                  </Typography>
                </Link>
              </MenuItem>{" "}
              <MenuItem>
                <Link to="/forms-copies-of-disciplinary-actions">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Copies of Disciplinary
                    <br /> Actions
                  </Typography>
                </Link>
              </MenuItem>{" "}
              <MenuItem>
                <Link to="/forms-contract-of-service">
                  <Typography sx={{ fontFamily: "Montserrat" }}>
                    Contract of Service (COS)
                  </Typography>
                </Link>
              </MenuItem>
            </SubMenu>

           
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

export default AdminSidebar;
