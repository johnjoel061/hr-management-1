import Header from "../../components/Header";
import {
  Box,
  Button,
  MenuItem,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Select,
  TextField,
  Autocomplete,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useSignup from "../../hooks/AuthHook/useSignup";
import useFetchDepartment from "../../hooks/DepartmentHook/useFetchDepartment";
import useFetchEligibilities from "../../hooks/EligibilityHook/useFetchEligibilities";
import { format } from "date-fns";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InputMask from "react-input-mask";

const AddEmployee = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { loading, error, registerUser } = useSignup();

  const {
    department,
    loading: departmentLoading,
    error: departmentError,
  } = useFetchDepartment();

  const { eligibilities } = useFetchEligibilities();

  const [formData, setFormData] = useState({
    employeeId: "",
    lastName: "",
    firstName: "",
    middleName: "",
    suffix: "NONE",
    gender: "",
    civilStatus: "",
    dateOfSeparation: "",
    causeOfSeparation: "NONE",
    officeAssignment: "",
    reAssignment: "NONE",
    firstDayOfService: "",
    salary:"",
    positionTitle: "",
    salaryGrade: "",
    stepIncrement: "",
    hiredDate: "",
    employmentStatus: "",
    dateOfLastPromotion: "",
    currentEmployment: "",
    dateOfBirth: "",
    tin: "",
    gsis: "",
    pagIbig: "",
    philHealth: "",
    bloodType: "",
    emergencyContactName: "",
    emergencyContact: "",
    contactNumber: "",
    educationalBackground: "",
    role: "",
    reportTo: "",
    email: "",
    password: "",
    passwordConfirm: "",
    employeeEligibilities: [],
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const formattedFormData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth
        ? format(new Date(formData.dateOfBirth), "MMMM d, yyyy")
        : "",
      dateOfSeparation: formData.dateOfSeparation
        ? format(new Date(formData.dateOfSeparation), "MMMM d, yyyy")
        : "",
      hiredDate: formData.hiredDate
        ? format(new Date(formData.hiredDate), "MMMM d, yyyy")
        : "",
      dateOfLastPromotion: formData.dateOfLastPromotion
        ? format(new Date(formData.dateOfLastPromotion), "MMMM d, yyyy")
        : "",
    };
    registerUser(formattedFormData);
  };

  //CHECKBOX SEARCH FILTER
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event, value) => {
    setSearchTerm(value);
  };

  const filteredEligibilities = eligibilities.filter((eligibility) =>
    eligibility.eligibilityTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleCheckboxChange = (eligibilityTitle) => {
    const isChecked = formData.employeeEligibilities.includes(eligibilityTitle);

    if (isChecked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        employeeEligibilities: prevFormData.employeeEligibilities.filter(
          (title) => title !== eligibilityTitle
        ),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        employeeEligibilities: [
          ...prevFormData.employeeEligibilities,
          eligibilityTitle,
        ],
      }));
    }
  };

  //Password Generator
  const generateRandomPassword = (length = 12) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const randomPassword = generateRandomPassword();
    setFormData((prevFormData) => ({
      ...prevFormData,
      password: randomPassword,
      passwordConfirm: randomPassword,
    }));
  };

  const columns = [
    { field: "eligibilityTitle", headerName: "Eligibility Title", flex: 1 },
    {
      field: "select",
      headerName: "Select",
      renderCell: (params) => (
        <Checkbox
          checked={formData.employeeEligibilities.includes(
            params.row.eligibilityTitle
          )}
          onChange={() => handleCheckboxChange(params.row.eligibilityTitle)}
          sx={{
            "&.Mui-checked": {
              color: "#f44336",
            },
          }}
        />
      ),
      sortable: false,
      width: 100,
    },
  ];

  return (
    <Box m="20px">
      <Header title="ADD EMPLOYEE" subtitle="Add New Employee" />

      <Box
        m="40px 0 0 0"
        height="90vh"
        width="150vh"
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
        {" "}
        <Header
          title={<span style={{ fontSize: "20px" }}>EMPLOYEE DETAILS</span>}
        />
        <form onSubmit={handleRegister} autoComplete="off" width="75vh">
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="employeeId"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Employee ID
                </InputLabel>
                <OutlinedInput
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  label="Employee ID"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="lastName"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Last Name
                </InputLabel>
                <OutlinedInput
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  label="Last Name"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="firstName"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  First Name
                </InputLabel>
                <OutlinedInput
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  label="First Name"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="middleName"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Middle Name
                </InputLabel>
                <OutlinedInput
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  label="Middle Name"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="suffix"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Suffix
                </InputLabel>
                <OutlinedInput
                  id="suffix"
                  name="suffix"
                  type="text"
                  value={formData.suffix}
                  onChange={handleInputChange}
                  label="Suffix"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="gender"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Sex
                </InputLabel>
                <Select
                  id="gender"
                  name="gender"
                  type="text"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Sex"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="bloodType"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Blood Type
                </InputLabel>
                <Select
                  id="bloodType"
                  name="bloodType"
                  type="text"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  label="blood Type"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="AB">AB</MenuItem>
                  <MenuItem value="O">O</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  label="Date of Birth"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                    "& .Mui-focused": {
                      color: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="civilStatus"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Civil Status
                </InputLabel>
                <Select
                  id="civilStatus"
                  name="civilStatus"
                  type="text"
                  value={formData.civilStatus}
                  onChange={handleInputChange}
                  label="Civil Status"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Annulled">Annulled</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                  <MenuItem value="Legally Separated">
                    Legally Separated
                  </MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  id="dateOfSeparation"
                  name="dateOfSeparation"
                  type="date"
                  value={formData.dateOfSeparation}
                  onChange={handleInputChange}
                  label="Date of Separation"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                    "& .Mui-focused": {
                      color: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="causeOfSeparation"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Cause of separation
                </InputLabel>
                <OutlinedInput
                  id="causeOfSeparation"
                  name="causeOfSeparation"
                  type="text"
                  value={formData.causeOfSeparation}
                  onChange={handleInputChange}
                  label="Cause of separation"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="officeAssignment"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Office Assignment
                </InputLabel>
                <Select
                  id="officeAssignment"
                  name="officeAssignment"
                  type="text"
                  value={formData.officeAssignment}
                  onChange={handleInputChange}
                  label="Office Assignment"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  {!departmentLoading &&
                    !departmentError &&
                    department.map((dept) => (
                      <MenuItem key={dept._id} value={dept.department}>
                        {dept.department}
                      </MenuItem>
                    ))}
                  ;
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="reAssignment"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Re-Assignment
                </InputLabel>
                <Select
                  id="reAssignment"
                  name="reAssignment"
                  type="text"
                  value={formData.reAssignment}
                  onChange={handleInputChange}
                  label="Re-Assignment"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="NONE">NONE</MenuItem>
                  {!departmentLoading &&
                    !departmentError &&
                    department.map((dept) => (
                      <MenuItem key={dept._id} value={dept.department}>
                        {dept.department}
                      </MenuItem>
                    ))}
                  ;
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="positionTitle"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Position Title
                </InputLabel>
                <OutlinedInput
                  id="positionTitle"
                  name="positionTitle"
                  type="text"
                  value={formData.positionTitle}
                  onChange={handleInputChange}
                  label="Position Title"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="salaryGrade"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Salary Grade
                </InputLabel>
                <OutlinedInput
                  id="salaryGrade"
                  name="salaryGrade"
                  type="number"
                  value={formData.salaryGrade}
                  onChange={handleInputChange}
                  label="Salary Grade"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="salary"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Salary
                </InputLabel>
                <OutlinedInput
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  label="Salary"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="stepIncrement"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Step Increment
                </InputLabel>
                <OutlinedInput
                  id="stepIncrement"
                  name="stepIncrement"
                  type="number"
                  value={formData.stepIncrement}
                  onChange={handleInputChange}
                  label="Step Increment"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  id="hiredDate"
                  name="hiredDate"
                  type="date"
                  value={formData.hiredDate}
                  onChange={handleInputChange}
                  label="Hired Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                    "& .Mui-focused": {
                      color: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  id="firstDayOfService"
                  name="firstDayOfService"
                  type="date"
                  value={formData.firstDayOfService}
                  onChange={handleInputChange}
                  label="First Day of Service"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                    "& .Mui-focused": {
                      color: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="employmentStatus"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Employment Status
                </InputLabel>
                <Select
                  id="employmentStatus"
                  name="employmentStatus"
                  type="text"
                  value={formData.employmentStatus}
                  onChange={handleInputChange}
                  label="Employment Status"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  id="dateOfLastPromotion"
                  name="dateOfLastPromotion"
                  type="date"
                  value={formData.dateOfLastPromotion}
                  onChange={handleInputChange}
                  label="Date of last Promotion"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                    "& .Mui-focused": {
                      color: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="statusOfCurrentEmployment"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Current Employment
                </InputLabel>
                <Select
                  id="currentEmployment"
                  name="currentEmployment"
                  type="text"
                  value={formData.currentEmployment}
                  onChange={handleInputChange}
                  label="Current Employment"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="Permanent">Permanent</MenuItem>
                  <MenuItem value="Temporary">Temporary</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                  <MenuItem value="Co-Terminus">Co-Terminus</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="tin"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  TIN Number
                </InputLabel>
                <InputMask
                  mask="999-999-999-999"
                  value={formData.tin}
                  onChange={handleInputChange}
                  maskChar=""
                >
                  {() => (
                    <OutlinedInput
                      id="tin"
                      name="tin"
                      type="text"
                      label="TIN Number"
                      required
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f44336",
                        },
                      }}
                    />
                  )}
                </InputMask>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="gsis"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  GSIS Number
                </InputLabel>
                <InputMask
                  mask="99-9999999-9"
                  value={formData.gsis}
                  onChange={handleInputChange}
                  maskChar=""
                >
                  {() => (
                    <OutlinedInput
                      id="gsis"
                      name="gsis"
                      type="text"
                      label="GSIS Number"
                      required
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f44336",
                        },
                      }}
                    />
                  )}
                </InputMask>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="pagIbig"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  PAG-IBIG Number
                </InputLabel>
                <InputMask
                  mask="9999-9999-9999"
                  value={formData.pagIbig}
                  onChange={handleInputChange}
                  maskChar=""
                >
                  {() => (
                    <OutlinedInput
                      id="pagIbig"
                      name="pagIbig"
                      type="text"
                      label="PAG-IBIG Number"
                      required
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f44336",
                        },
                      }}
                    />
                  )}
                </InputMask>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="philHealth"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  PHIL-HEALTH Number
                </InputLabel>
                <InputMask
                  mask="99-999999999-9"
                  value={formData.philHealth}
                  onChange={handleInputChange}
                  maskChar=""
                >
                  {() => (
                    <OutlinedInput
                      id="philHealth"
                      name="philHealth"
                      type="text"
                      label="PHIL-HEALTH Number"
                      required
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f44336",
                        },
                      }}
                    />
                  )}
                </InputMask>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="contactNumber"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Employee Contact Number
                </InputLabel>
                <InputMask
                  mask="0999-999-9999"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  maskChar=""
                >
                  {() => (
                    <OutlinedInput
                      id="contactNumber"
                      name="contactNumber"
                      type="text"
                      label="Employee Contact Number"
                      required
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f44336",
                        },
                      }}
                    />
                  )}
                </InputMask>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="emergencyContactName"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Emergency Contact Name
                </InputLabel>
                <OutlinedInput
                  id="emergencyContactName"
                  name="emergencyContactName"
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  label="Emergency Contact Name"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="emergencyContact"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Emergency Contact Number
                </InputLabel>
                <InputMask
                  mask="0999-999-9999"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  maskChar=""
                >
                  {() => (
                    <OutlinedInput
                      id="emergencyContact"
                      name="emergencyContact"
                      type="text"
                      label="Emergency Contact Number"
                      required
                      sx={{
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#f44336",
                        },
                      }}
                    />
                  )}
                </InputMask>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="role"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Role
                </InputLabel>
                <Select
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                >
                  <MenuItem value="M-ADMIN">M-ADMIN</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="HOD">HOD</MenuItem>
                  <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="reportTo"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Reports To (Department/Unit/Section Head)
                </InputLabel>
                <OutlinedInput
                  id="reportTo"
                  name="reportTo"
                  type="text"
                  value={formData.reportTo}
                  onChange={handleInputChange}
                  label="Reports To (Department/Unit/Section Head)"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="email"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Email
                </InputLabel>
                <OutlinedInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  label="Email"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="password"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  label="Password"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel
                  htmlFor="passwordConfirm"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type={showPassword ? "text" : "password"}
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  label="Confirm Password"
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>
            {/* Add more fields as per your schema */}
            {/* Generate Password Button */}
            <Grid item xs={12} mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleGeneratePassword}
              >
                Generate Password
              </Button>
            </Grid>
          </Grid>

          {/* EDUCATIONAL BACKGROUND */}
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={6} mt={8}>
                <h2>EDUCATIONAL BACKGROUND</h2>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    htmlFor="educationalBackground"
                    sx={{ "&.Mui-focused": { color: "#f44336" } }}
                  >
                    Educational Background
                  </InputLabel>
                  <OutlinedInput
                    id="educationalBackground"
                    name="educationalBackground"
                    type="text"
                    value={formData.educationalBackground}
                    onChange={handleInputChange}
                    label="Educational Background"
                    required
                    sx={{
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#f44336",
                      },
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {/* CHECKBOX LATER HERE FOR ELIGIBILITIES */}
            {/* Eligibilities */}
            <FormControl fullWidth margin="normal">
              <h2>ELIGIBILITY/IES</h2>
              <Autocomplete
                freeSolo
                inputValue={searchTerm}
                onInputChange={(e, value) => handleSearchChange(e, value)}
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Search Eligibility"
                    placeholder="Type to search..."
                  />
                )}
              />
              <Box mt={2} height={400}>
                <DataGrid
                  rows={filteredEligibilities}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  disableSelectionOnClick
                  getRowId={(row) => row._id}
                />
              </Box>
            </FormControl>
          </Box>

          <Grid container justifyContent="center">
            <Grid item>
              <Box mt={10} mb={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  disabled={loading}
                >
                  <Box>
                    {loading ? <CircularProgress size={26} /> : "ADD EMPLOYEE"}
                  </Box>
                </Button>
                {error && <FormHelperText error>{error}</FormHelperText>}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddEmployee;
