import { useState } from "react";
import { useParams } from "react-router-dom";
import useFetchUserById from "../../hooks/UserHook/useFetchUserById";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import * as XLSX from "xlsx";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import useFetchLeaveType from "../../hooks/LeaveTypeHook/useFetchLeaveType";

import useFetchLearningDevelopment from "../../hooks/LearningDevelopmentHook/useFetchLearningDevelopment";
import useDeleteLearningDevelopment from "../../hooks/LearningDevelopmentHook/useDeleteLearningDevelopment";
import useUpdateLearningDevelopment from "../../hooks/LearningDevelopmentHook/useUpdateLearningDevelopment";
import useAddLearningDevelopment from "../../hooks/LearningDevelopmentHook/useAddLearningDevelopment";

import useFetchLeaveRecord from "../../hooks/LeaveRecordHook/useFetchLeaveRecord";
import useDeleteLeaveRecord from "../../hooks/LeaveRecordHook/useDeleteLeaveRecord";
import useUpdateLeaveRecord from "../../hooks/LeaveRecordHook/useUpdateLeaveRecord";
import useAddLeaveRecord from "../../hooks/LeaveRecordHook/useAddLeaveRecord";

import useFetchServiceRecord from "../../hooks/ServiceRecordHook/useFetchServiceRecord";
import useDeleteServiceRecord from "../../hooks/ServiceRecordHook/useDeleteServiceRecord";
import useUpdateServiceRecord from "../../hooks/ServiceRecordHook/useUpdateServiceRecord";
import useAddServiceRecord from "../../hooks/ServiceRecordHook/useAddServiceRecord";

import useFetchPerformanceRating from "../../hooks/PerformanceRatingHook/useFetchPerformanceRating";
import useDeletePerformanceRating from "../../hooks/PerformanceRatingHook/useDeletePerformanceRating";
import useUpdatePerformanceRating from "../../hooks/PerformanceRatingHook/useUpdatePerformanceRating";
import useAddPerformanceRating from "../../hooks/PerformanceRatingHook/useAddPerformanceRating";

import useAddAward from "../../hooks/AwardHook/useAddAward";
import useDeleteAward from "../../hooks/AwardHook/useDeleteAward";
import useUpdateAward from "../../hooks/AwardHook/useUpdateAward";
import useFetchAward from "../../hooks/AwardHook/useFetchAward";

import {
  Card,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Header from "../../components/Header";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { format } from "date-fns";
import { styled as muiStyled } from "@mui/system";
import styled from "styled-components";
import { message } from "antd";

const StyledCard = styled.div`
  "@media (max-width: 780px)": {
    margin: "10px",
  },
`;

const BoldText = muiStyled("span")({
  fontWeight: "bold",
});

const Wrapper = styled.div`
  font-family: "Montserrat", sans-serif;
`;

const EmployeeDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams();

  {
    /*==============================LEARNING AND DEVELOPMENT START===============================*/
  }
  const {
    userData,
    loading: userLoading,
    error: userError,
  } = useFetchUserById(id);

  const {
    leaveType,
    loading: leaveTypeLoading,
    error: leaveTypeError,
  } = useFetchLeaveType();

  const {
    learningDevelopment,
    loading: ldLoading,
    error: ldError,
    refetchLearningDevelopment,
  } = useFetchLearningDevelopment(id);

  const {
    addLearningDevelopment,
    loading: addLoading,
    error: addError,
  } = useAddLearningDevelopment();

  const {
    updateLearningDevelopment,
    loading: updateLoading,
    error: updateError,
  } = useUpdateLearningDevelopment();

  const {
    deleteLearningDevelopment,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteLearningDevelopment();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentLD, setCurrentLD] = useState(null);
  const [newLDData, setNewLDData] = useState({
    trainingTitle: "",
    dateStart: "",
    dateEnd: "",
    numberOfHours: "",
    ldType: "",
    venue: "",
    sponsoredBy: "",
  });

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewLDData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLD((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewLDData({
      trainingTitle: "",
      dateStart: "",
      dateEnd: "",
      numberOfHours: "",
      ldType: "",
      venue: "",
      sponsoredBy: "",
    });
  };

  const handleEditDialogOpen = (ld) => {
    setCurrentLD(ld);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentLD(null);
  };

  const handleDeleteDialogOpen = (ld) => {
    setCurrentLD(ld);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentLD(null);
  };

  const handleConfirmAdd = async () => {
    if (
      newLDData.trainingTitle &&
      newLDData.dateStart &&
      newLDData.dateEnd &&
      newLDData.numberOfHours &&
      newLDData.ldType &&
      newLDData.venue &&
      newLDData.sponsoredBy
    ) {
      await addLearningDevelopment(id, newLDData);
      handleAddDialogClose();
      refetchLearningDevelopment();
    } else {
      // Show an error message or handle the empty fields
      message.error("Please fill all required fields.");
    }
  };

  const handleConfirmEdit = async () => {
    await updateLearningDevelopment(id, currentLD._id, currentLD);
    handleEditDialogClose();
    refetchLearningDevelopment();
  };

  const handleConfirmDelete = async () => {
    await deleteLearningDevelopment(id, currentLD._id);
    handleDeleteDialogClose();
    refetchLearningDevelopment();
  };

  {
    /*==============================LEARNING AND DEVELOPMENT END===============================*/
  }

  {
    /*==============================LEAVE RECORD START===============================*/
  }
  const {
    leaveRecord,
    loading: lrLoading,
    error: lrError,
    refetchLeaveRecord,
  } = useFetchLeaveRecord(id);

  const {
    addLeaveRecord,
    loading: addLrLoading,
    error: addLrError,
  } = useAddLeaveRecord();

  const {
    updateLeaveRecord,
    loading: updateLrLoading,
    error: updateLrError,
  } = useUpdateLeaveRecord();

  const {
    deleteLeaveRecord,
    loading: deleteLrLoading,
    error: deleteLrError,
  } = useDeleteLeaveRecord();

  const [editLrDialogOpen, setEditLrDialogOpen] = useState(false);
  const [addLrDialogOpen, setAddLrDialogOpen] = useState(false);
  const [deleteLrDialogOpen, setDeleteLrDialogOpen] = useState(false);
  const [currentLR, setCurrentLR] = useState(null);
  const [newLRData, setNewLRData] = useState({
    period: "",
    particular: "",
    earned: "",
    absentUnderWithPay: "",
    balance: "",
    absentUnderWithoutPay: "",
    dateTakenOnForLeave: "",
    actionTakenOnForLeave: "",
  });

  const handleAddLrInputChange = (e) => {
    const { name, value } = e.target;
    setNewLRData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditLrInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLR((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddLrDialogOpen = () => {
    setAddLrDialogOpen(true);
  };

  const handleAddLrDialogClose = () => {
    setAddLrDialogOpen(false);
    setNewLRData({
      period: "",
      particular: "",
      earned: "",
      absentUnderWithPay: "",
      balance: "",
      absentUnderWithoutPay: "",
      dateTakenOnForLeave: "",
      actionTakenOnForLeave: "",
    });
  };

  const handleEditLrDialogOpen = (lr) => {
    setCurrentLR(lr);
    setEditLrDialogOpen(true);
  };

  const handleEditLrDialogClose = () => {
    setEditLrDialogOpen(false);
    setCurrentLR(null);
  };

  const handleDeleteLrDialogOpen = (lr) => {
    setCurrentLR(lr);
    setDeleteLrDialogOpen(true);
  };

  const handleDeleteLrDialogClose = () => {
    setDeleteLrDialogOpen(false);
    setCurrentLR(null);
  };

  const handleConfirmAddLR = async () => {
    if (
      newLRData.period &&
      newLRData.particular &&
      newLRData.earned &&
      newLRData.absentUnderWithPay &&
      newLRData.balance &&
      newLRData.absentUnderWithoutPay &&
      newLRData.dateTakenOnForLeave &&
      newLRData.actionTakenOnForLeave
    ) {
      await addLeaveRecord(id, newLRData);
      handleAddLrDialogClose();
      refetchLeaveRecord();
    } else {
      // Show an error message or handle the empty fields
      message.error("Please fill all required fields.");
    }
  };

  const handleConfirmEditLR = async () => {
    await updateLeaveRecord(id, currentLR._id, currentLR);
    handleEditLrDialogClose();
    refetchLeaveRecord();
  };

  const handleConfirmDeleteLR = async () => {
    await deleteLeaveRecord(id, currentLR._id);
    handleDeleteLrDialogClose();
    refetchLeaveRecord();
  };

  {
    /*==============================LEAVE RECORD END===============================*/
  }

  {
    /*==============================SERVICE RECORD START===============================*/
  }

  const {
    serviceRecord,
    loading: srLoading,
    error: srError,
    refetchServiceRecord,
  } = useFetchServiceRecord(id);

  const {
    addServiceRecord,
    loading: addSrLoading,
    error: addSrError,
  } = useAddServiceRecord();

  const {
    updateServiceRecord,
    loading: updateSrLoading,
    error: updateSrError,
  } = useUpdateServiceRecord();

  const {
    deleteServiceRecord,
    loading: deleteSrLoading,
    error: deleteSrError,
  } = useDeleteServiceRecord();

  const [editSrDialogOpen, setEditSrDialogOpen] = useState(false);
  const [addSrDialogOpen, setAddSrDialogOpen] = useState(false);
  const [deleteSrDialogOpen, setDeleteSrDialogOpen] = useState(false);
  const [currentSR, setCurrentSR] = useState(null);
  const [newSRData, setNewSRData] = useState({
    inclusiveDateFrom: "",
    inclusiveDateTo: "",
    designation: "",
    status: "",
    salary: "",
    station: "",
    branch: "",
    wPay: "",
    separationDate: "",
    separationCause: "",
  });

  const handleAddSrInputChange = (e) => {
    const { name, value } = e.target;
    setNewSRData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditSrInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSR((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddSrDialogOpen = () => {
    setAddSrDialogOpen(true);
  };

  const handleAddSrDialogClose = () => {
    setAddSrDialogOpen(false);
    setNewSRData({
      inclusiveDateFrom: "",
      inclusiveDateTo: "",
      designation: "",
      status: "",
      salary: "",
      station: "",
      branch: "",
      wPay: "",
      separationDate: "",
      separationCause: "",
    });
  };

  const handleEditSrDialogOpen = (sr) => {
    setCurrentSR(sr);
    setEditSrDialogOpen(true);
  };

  const handleEditSrDialogClose = () => {
    setEditSrDialogOpen(false);
    setCurrentSR(null);
  };

  const handleDeleteSrDialogOpen = (sr) => {
    setCurrentSR(sr);
    setDeleteSrDialogOpen(true);
  };

  const handleDeleteSrDialogClose = () => {
    setDeleteSrDialogOpen(false);
    setCurrentSR(null);
  };

  const handleConfirmAddSR = async () => {
    if (
      newSRData.inclusiveDateFrom &&
      newSRData.inclusiveDateTo &&
      newSRData.designation &&
      newSRData.status &&
      newSRData.salary &&
      newSRData.station &&
      newSRData.branch &&
      newSRData.wPay &&
      //newSRData.separationDate &&
      newSRData.separationCause
    ) {
      await addServiceRecord(id, newSRData);
      handleAddSrDialogClose();
      refetchServiceRecord();
    } else {
      // Show an error message or handle the empty fields
      message.error("Please fill all required fields.");
    }
  };

  const handleConfirmEditSR = async () => {
    await updateServiceRecord(id, currentSR._id, currentSR);
    handleEditSrDialogClose();
    refetchServiceRecord();
  };

  const handleConfirmDeleteSR = async () => {
    await deleteServiceRecord(id, currentSR._id);
    handleDeleteSrDialogClose();
    refetchServiceRecord();
  };

  {
    /*==============================SERVICE RECORD END===============================*/
  }

  {
    /*==============================PERFORMANCE RATING START===============================*/
  }
  const {
    performanceRating,
    loading: prLoading,
    error: prError,
    refetchPerformanceRating,
  } = useFetchPerformanceRating(id);

  const {
    addPerformanceRating,
    loading: addPrLoading,
    error: addPrError,
  } = useAddPerformanceRating();

  const {
    updatePerformanceRating,
    loading: updatePrLoading,
    error: updatePrError,
  } = useUpdatePerformanceRating();

  const {
    deletePerformanceRating,
    loading: deletePrLoading,
    error: deletePrError,
  } = useDeletePerformanceRating();

  const [editPrDialogOpen, setEditPrDialogOpen] = useState(false);
  const [addPrDialogOpen, setAddPrDialogOpen] = useState(false);
  const [deletePrDialogOpen, setDeletePrDialogOpen] = useState(false);
  const [currentPR, setCurrentPR] = useState(null);
  const [newPRData, setNewPRData] = useState({
    semester: "",
    year: "",
    numericalRating: "",
    adjectivalRating: "",
  });

  const handleAddPrInputChange = (e) => {
    const { name, value } = e.target;
    setNewPRData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditPrInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPR((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddPrDialogOpen = () => {
    setAddPrDialogOpen(true);
  };

  const handleAddPrDialogClose = () => {
    setAddPrDialogOpen(false);
    setNewPRData({
      semester: "",
      year: "",
      numericalRating: "",
      adjectivalRating: "",
    });
  };

  const handleEditPrDialogOpen = (pr) => {
    setCurrentPR(pr);
    setEditPrDialogOpen(true);
  };

  const handleEditPrDialogClose = () => {
    setEditPrDialogOpen(false);
    setCurrentPR(null);
  };

  const handleDeletePrDialogOpen = (pr) => {
    setCurrentPR(pr);
    setDeletePrDialogOpen(true);
  };

  const handleDeletePrDialogClose = () => {
    setDeletePrDialogOpen(false);
    setCurrentPR(null);
  };

  const handleConfirmAddPR = async () => {
    if (
      newPRData.semester &&
      newPRData.year &&
      newPRData.numericalRating &&
      newPRData.adjectivalRating
    ) {
      await addPerformanceRating(id, newPRData);
      handleAddPrDialogClose();
      refetchPerformanceRating();
    } else {
      // Show an error message or handle the empty fields
      message.error("Please fill all required fields.");
    }
  };

  const handleConfirmEditPR = async () => {
    await updatePerformanceRating(id, currentPR._id, currentPR);
    handleEditPrDialogClose();
    refetchPerformanceRating();
  };

  const handleConfirmDeletePR = async () => {
    await deletePerformanceRating(id, currentPR._id);
    handleDeletePrDialogClose();
    refetchPerformanceRating();
  };

  {
    /*==============================PERFORMANCE RATING END===============================*/
  }

  {
    /*==============================AWARDS START===============================*/
  }
  const {
    award,
    loading: awLoading,
    error: awError,
    refetchAward,
  } = useFetchAward(id);

  const { addAward, loading: addAwLoading, error: addAwError } = useAddAward();

  const {
    updateAward,
    loading: updateAwLoading,
    error: updateAwError,
  } = useUpdateAward();

  const {
    deleteAward,
    loading: deleteAwLoading,
    error: deleteAwError,
  } = useDeleteAward();

  const [editAwDialogOpen, setEditAwDialogOpen] = useState(false);
  const [addAwDialogOpen, setAddAwDialogOpen] = useState(false);
  const [deleteAwDialogOpen, setDeleteAwDialogOpen] = useState(false);
  const [currentAW, setCurrentAW] = useState(null);
  const [newAWData, setNewAWData] = useState({
    nameOfAward: "",
    levelOfAward: "",
    dateOfAward: "",
    issuedBy: "",
  });

  const handleAddAwInputChange = (e) => {
    const { name, value } = e.target;
    setNewAWData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditAwInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAW((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddAwDialogOpen = () => {
    setAddAwDialogOpen(true);
  };

  const handleAddAwDialogClose = () => {
    setAddAwDialogOpen(false);
    setNewAWData({
      nameOfAward: "",
      levelOfAward: "",
      dateOfAward: "",
      issuedBy: "",
    });
  };

  const handleEditAwDialogOpen = (aw) => {
    setCurrentAW(aw);
    setEditAwDialogOpen(true);
  };

  const handleEditAwDialogClose = () => {
    setEditAwDialogOpen(false);
    setCurrentAW(null);
  };

  const handleDeleteAwDialogOpen = (aw) => {
    setCurrentAW(aw);
    setDeleteAwDialogOpen(true);
  };

  const handleDeleteAwDialogClose = () => {
    setDeleteAwDialogOpen(false);
    setCurrentAW(null);
  };

  const handleConfirmAddAW = async () => {
    if (
      newAWData.nameOfAward &&
      newAWData.levelOfAward &&
      newAWData.dateOfAward &&
      newAWData.issuedBy
    ) {
      await addAward(id, newAWData);
      handleAddAwDialogClose();
      refetchAward();
    } else {
      // Show an error message or handle the empty fields
      message.error("Please fill all required fields.");
    }
  };

  const handleConfirmEditAW = async () => {
    await updateAward(id, currentAW._id, currentAW);
    handleEditAwDialogClose();
    refetchAward();
  };

  const handleConfirmDeleteAW = async () => {
    await deleteAward(id, currentAW._id);
    handleDeleteAwDialogClose();
    refetchAward();
  };

  {
    /*==============================AWARDS END===============================*/
  }

  {
    /*==============================LEARNING AND DEVELOPMENT COLUMNS===============================*/
  }
  const columns = [
    {
      field: "trainingTitle",
      headerName: "LEARNING DEVELOPMENT TITLE",
      width: 230,
    },
    {
      field: "dateStart",
      headerName: "DATE STARTED",
      width: 150,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "dateEnd",
      headerName: "DATE ENDED",
      width: 150,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    { field: "numberOfHours", headerName: "NO. OF HOURS", width: 150 },
    {
      field: "ldType",
      headerName: "TYPE OF LD (Managerial/Supervisory/Technical/etc)",
      width: 370,
    },
    { field: "venue", headerName: "VENUE", width: 250 },
    { field: "sponsoredBy", headerName: "CONDUCTED/SPONSORED BY", width: 250 },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 185,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
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
            onClick={() => handleEditDialogOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteDialogOpen(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  {
    /*==============================LEAVE RECORD COLUMNS===============================*/
  }
  const leaveRecordColumns = [
    { field: "period", headerName: "PERIOD", width: 150 },
    { field: "particular", headerName: "PARTICULARS", width: 500 },
    { field: "earned", headerName: "EARNED", width: 150 },
    {
      field: "absentUnderWithPay",
      headerName: "ABSENT UNDER WITH PAY",
      width: 230,
    },
    { field: "balance", headerName: "BALANCE", width: 150 },
    {
      field: "absentUnderWithoutPay",
      headerName: "ABSENT UNDER WITHOUT PAY",
      width: 250,
    },
    {
      field: "dateTakenOnForLeave",
      headerName: "DATE TAKEN ON APPLICATION FOR LEAVE",
      width: 280,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "actionTakenOnForLeave",
      headerName: "DATE TAKEN ON APPLICATION FOR LEAVE",
      width: 280,
    },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 210,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
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
            onClick={() => handleEditLrDialogOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteLrDialogOpen(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  {
    /*==============================LEAVE RECORD COLUMNS===============================*/
  }
  {
    /*==============================SERVICE RECORD COLUMNS===============================*/
  }
  const serviceRecordColumns = [
    {
      field: "inclusiveDateFrom",
      headerName: "INCLUSIVE DATE FROM",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "inclusiveDateTo",
      headerName: "INCLUSIVE DATE TO",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    { field: "designation", headerName: "DESIGNATION", width: 200 },
    { field: "status", headerName: "STATUS", width: 150 },
    { field: "salary", headerName: "SALARY", width: 150 },
    {
      field: "station",
      headerName: "STATION/PLACE",
      width: 200,
    },
    {
      field: "branch",
      headerName: "BRANCH",
      width: 200,
    },
    {
      field: "wPay",
      headerName: "W/PAY",
      width: 200,
    },
    {
      field: "separationDate",
      headerName: "SEPARATION DATE",
      width: 200,
      renderCell: (params) => {
        const dateValue = params.value ? new Date(params.value) : null;

        // Check if date is valid
        return (
          <span>
            {dateValue && !isNaN(dateValue.getTime())
              ? format(dateValue, "MMMM d, yyyy")
              : "N/A"}
          </span>
        );
      },
    },
    {
      field: "separationCause",
      headerName: "SEPARATION CAUSE",
      width: 200,
    },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 180,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
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
            onClick={() => handleEditSrDialogOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteSrDialogOpen(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  {
    /*==============================SERVICE RECORD COLUMNS===============================*/
  }

  {
    /*================================PERFORMANCE RATING COLUMNS================================*/
  }
  const performanceRatingColumns = [
    { field: "semester", headerName: "SEMESTER", width: 200 },
    { field: "year", headerName: "YEAR", width: 180 },
    { field: "numericalRating", headerName: "NUMERICAL RATING", width: 200 },
    { field: "adjectivalRating", headerName: "ADJECTIVAL RATING", width: 200 },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 180,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
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
            onClick={() => handleEditPrDialogOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeletePrDialogOpen(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  {
    /*=================================PERFORMANCE RATING COLUMNS================================*/
  }
  
  {
    /*==============================AWARDS COLUMNS===============================*/
  }
  const awardColumns = [
    { field: "nameOfAward", headerName: "NAME OF AWARD", width: 250 },
    { field: "levelOfAward", headerName: "LEVEL OF AWARD", width: 180 },
    {
      field: "dateOfAward",
      headerName: "DATE OF AWARD",
      width: 180,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    { field: "issuedBy", headerName: "ISSUED BY", width: 250 },
    {
      field: "createdAt",
      headerName: "Date & Time Created",
      width: 180,
      renderCell: (params) => (
        <span>
          {format(new Date(params.value), "MMMM d, yyyy - h:mm:ss aa")}
        </span>
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8 }}
            onClick={() => handleEditAwDialogOpen(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDeleteAwDialogOpen(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  {
    /*==============================AWARDS COLUMNS===============================*/
  }

  //EXPORT DATA EXCEL
  const handleExportToExcelLearningDevelopment = () => {
    const lastName = userData.lastName;
    const firstName = userData.firstName;
    const worksheet = XLSX.utils.json_to_sheet(learningDevelopment);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LD Data Sheets");
    XLSX.writeFile(workbook, `${firstName}_${lastName}_LD_data_sheets.xlsx`);
  };
  //EXPORT DATA EXCEL
  const handleExportToExcelLeaveRecord = () => {
    const lastName = userData.lastName;
    const firstName = userData.firstName;
    const worksheet = XLSX.utils.json_to_sheet(leaveRecord);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LR Data Sheets");
    XLSX.writeFile(
      workbook,
      `${firstName}_${lastName}_LeaveRecord_data_sheets.xlsx`
    );
  };
  //EXPORT DATA EXCEL
  const handleExportToExcelServiceRecord = () => {
    const lastName = userData.lastName;
    const firstName = userData.firstName;
    const worksheet = XLSX.utils.json_to_sheet(serviceRecord);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SR Data Sheets");
    XLSX.writeFile(
      workbook,
      `${firstName}_${lastName}_ServiceRecord_data_sheets.xlsx`
    );
  };
  //EXPORT DATA EXCEL
  const handleExportToExcelPerformanceRating = () => {
    const lastName = userData.lastName;
    const firstName = userData.firstName;
    const worksheet = XLSX.utils.json_to_sheet(performanceRating);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PR Data Sheets");
    XLSX.writeFile(
      workbook,
      `${firstName}_${lastName}_PerformanceRating_data_sheets.xlsx`
    );
  };

  //EXPORT DATA EXCEL
  const handleExportToExcelAward = () => {
    const lastName = userData.lastName;
    const firstName = userData.firstName;
    const worksheet = XLSX.utils.json_to_sheet(award);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AW Data Sheets");
    XLSX.writeFile(workbook, `${firstName}_${lastName}_award_data_sheets.xlsx`);
  };

  if (userLoading) {
    return <CircularProgress />;
  }

  if (userError) {
    return (
      <Typography variant="h6" color="error">
        Failed to load user data: {userError.message}
      </Typography>
    );
  }

  if (!userData) {
    return (
      <Typography variant="h6" color="error">
        User data not found.
      </Typography>
    );
  }

  return (
    <Wrapper>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="EMPLOYEE DETAILS" subtitle="View Employee Details!" />
        </Box>

        <Box
          m="40px 0"
          display="flex"
          justifyContent="left"
          alignItems="center"
        >
          <StyledCard style={{ width: 1000 }}>
            <Card variant="outlined" sx={{ padding: 2 }}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={12} sm={12} md={4} lg={3} textAlign="center">
                  <Avatar
                    alt={userData.firstName}
                    src={userData.avatar}
                    sx={{ width: 150, height: 150, margin: "auto" }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={9}>
                  <Typography variant="h4">
                    {userData.lastName}, {userData.firstName},{" "}
                    {userData.middleName}
                  </Typography>
                  <Typography variant="subtitle1">
                    {userData.officeAssignment}
                  </Typography>
                  <Typography variant="body1">
                    {userData.positionTitle}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Employee ID:</BoldText> {userData.employeeId}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Hired Date:</BoldText> {userData.hiredDate}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Reports To:</BoldText> {userData.reportTo}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>PERSONAL INFORMATION</BoldText>
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Last Name:</BoldText> {userData.lastName}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>First Name:</BoldText> {userData.firstName}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Middle Name:</BoldText> {userData.middleName}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Suffix (Jr., II, III, IV):</BoldText>{" "}
                    {userData.suffix}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Sex:</BoldText> {userData.gender}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Date of Birth (MM/DD/YYYY):</BoldText>{" "}
                    {userData.dateOfBirth}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Blood Type:</BoldText> {userData.bloodType}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Civil Status:</BoldText> {userData.civilStatus}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Date of Separation:</BoldText>{" "}
                    {userData.dateOfSeparation}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Cause of Separation:</BoldText>{" "}
                    {userData.causeOfSeparation}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Signature:</BoldText>{" "}
                  </Typography>
                  <Grid item xs={12} sm={12} md={4} lg={3} textAlign="center">
                    <Avatar
                      alt={userData.firstName}
                      src={userData.signature}
                      variant="square"
                      sx={{
                        width: 200,
                        height: 100,
                        margin: "auto",
                        objectFit: "cover",
                        background: "#bfbfbf",
                        marginTop: "5px",
                        borderRadius: "6px",
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>EMPLOYMENT DETAILS</BoldText>
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Employee ID:</BoldText> {userData.employeeId}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Hired Date:</BoldText> {userData.hiredDate}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>First Day of Service:</BoldText>{" "}
                    {userData.firstDayOfService}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Office Assignment:</BoldText>{" "}
                    {userData.officeAssignment}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Reassignment:</BoldText> {userData.reAssignment}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Position Title:</BoldText>{" "}
                    {userData.positionTitle}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Employment Status:</BoldText>{" "}
                    {userData.employmentStatus}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Current Employment:</BoldText>{" "}
                    {userData.currentEmployment}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Years of Service:</BoldText>{" "}
                    {userData.yearsOfService}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Role:</BoldText> {userData.role}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>CONTACT INFORMATION</BoldText>
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Email:</BoldText> {userData.email}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Employee Contact Number:</BoldText>{" "}
                    {userData.contactNumber}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>In case of emergency, Contact Name:</BoldText>{" "}
                    {userData.emergencyContactName}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>In case of emergency, Contact Number:</BoldText>{" "}
                    {userData.emergencyContact}
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>SALARY AND PROMOTION</BoldText>
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Salary Grade:</BoldText> {userData.salaryGrade}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Salary:</BoldText> {userData.salary}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Step Increment:</BoldText>{" "}
                    {userData.stepIncrement}
                  </Typography>
                  <Typography variant="body2">
                    <BoldText>Date of Last Promotion:</BoldText>{" "}
                    {userData.dateOfLastPromotion}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>ELIGIBILITY/IES</BoldText>
                  </Typography>
                  <ul style={{ marginLeft: "20px" }}>
                    {userData.employeeEligibilities.map(
                      (eligibility, index) => (
                        <li key={index}>{eligibility}</li>
                      )
                    )}
                  </ul>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>
                      LEARNING & DEVELOPMENT (LD) INTERVENTIONS/TRAINING
                      PROGRAMS ATTENDED
                    </BoldText>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleAddDialogOpen}
                        style={{ margin: "20px 0 0 0" }}
                      >
                        <Box display="flex" alignItems="center">
                          <AddCircleOutlineOutlinedIcon />
                          <Box ml={1}>Add New LD</Box>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleExportToExcelLearningDevelopment}
                        style={{ margin: "20px 0 0 0" }}
                        sx={{
                          backgroundColor: "#388E3C",
                          color: "##e0e0e0",
                          margin: "0 20px",
                          "&:hover": {
                            backgroundColor: "#45A049",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <FileDownloadOutlinedIcon />
                        </Box>
                      </Button>
                    </Box>
                    <Box
                      m="10px 0 0 0"
                      height="70vh"
                      width="63vw"
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
                      {ldLoading ? (
                        <CircularProgress />
                      ) : ldError ? (
                        <Typography variant="h6" color="error">
                          Failed to load learning development data:{" "}
                          {ldError.message}
                        </Typography>
                      ) : (
                        <DataGrid
                          rows={learningDevelopment || []} 
                          columns={columns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row._id}
                        />
                      )}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>LEAVE RECORD</BoldText>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleAddLrDialogOpen}
                        style={{ margin: "20px 0 0 0" }}
                      >
                        <Box display="flex" alignItems="center">
                          <AddCircleOutlineOutlinedIcon />
                          <Box ml={1}>Add New Leave Record</Box>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleExportToExcelLeaveRecord}
                        style={{ margin: "20px 0 0 0" }}
                        sx={{
                          backgroundColor: "#388E3C",
                          color: "##e0e0e0",
                          margin: "0 20px",
                          "&:hover": {
                            backgroundColor: "#45A049",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <FileDownloadOutlinedIcon />
                        </Box>
                      </Button>
                    </Box>

                    {/*BOX AND GRID LATER */}
                    <Box
                      m="10px 0 0 0"
                      height="70vh"
                      width="63vw"
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
                      {lrLoading ? (
                        <CircularProgress />
                      ) : lrError ? (
                        <Typography variant="h6" color="error">
                          Failed to load leave record data: {lrError.message}
                        </Typography>
                      ) : (
                        <DataGrid
                          rows={leaveRecord || []} // Ensure rows is always an array
                          columns={leaveRecordColumns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row._id}
                        />
                      )}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>SERVICE RECORD</BoldText>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleAddSrDialogOpen}
                        style={{ margin: "20px 0 0 0" }}
                      >
                        <Box display="flex" alignItems="center">
                          <AddCircleOutlineOutlinedIcon />
                          <Box ml={1}>Add New Service Record</Box>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleExportToExcelServiceRecord}
                        style={{ margin: "20px 0 0 0" }}
                        sx={{
                          backgroundColor: "#388E3C",
                          color: "##e0e0e0",
                          margin: "0 20px",
                          "&:hover": {
                            backgroundColor: "#45A049",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <FileDownloadOutlinedIcon />
                        </Box>
                      </Button>
                    </Box>
                    {/*BOX AND GRID LATER */}
                    <Box
                      m="10px 0 0 0"
                      height="70vh"
                      width="63vw"
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
                      {srLoading ? (
                        <CircularProgress />
                      ) : srError ? (
                        <Typography variant="h6" color="error">
                          Failed to load service record data: {srError.message}
                        </Typography>
                      ) : (
                        <DataGrid
                          rows={serviceRecord || []} // Ensure rows is always an array
                          columns={serviceRecordColumns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row._id}
                        />
                      )}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>PERFORMANCE RATING</BoldText>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleAddPrDialogOpen}
                        style={{ margin: "20px 0 0 0" }}
                      >
                        <Box display="flex" alignItems="center">
                          <AddCircleOutlineOutlinedIcon />
                          <Box ml={1}>Add New Performance Rating</Box>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleExportToExcelPerformanceRating}
                        style={{ margin: "20px 0 0 0" }}
                        sx={{
                          backgroundColor: "#388E3C",
                          color: "##e0e0e0",
                          margin: "0 20px",
                          "&:hover": {
                            backgroundColor: "#45A049",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <FileDownloadOutlinedIcon />
                        </Box>
                      </Button>
                    </Box>
                    {/*BOX AND GRID LATER */}
                    <Box
                      m="10px 0 0 0"
                      height="70vh"
                      width="63vw"
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
                      {prLoading ? (
                        <CircularProgress />
                      ) : prError ? (
                        <Typography variant="h6" color="error">
                          Failed to load performance rating data:{" "}
                          {prError.message}
                        </Typography>
                      ) : (
                        <DataGrid
                          rows={performanceRating || []} // Ensure rows is always an array
                          columns={performanceRatingColumns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row._id}
                        />
                      )}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Card>

            <Card variant="outlined" sx={{ marginTop: 3, padding: 2 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ marginBottom: 2 }}>
                    <BoldText>AWARDS</BoldText>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleAddAwDialogOpen}
                        style={{ margin: "20px 0 0 0" }}
                      >
                        <Box display="flex" alignItems="center">
                          <AddCircleOutlineOutlinedIcon />
                          <Box ml={1}>Add New Award</Box>
                        </Box>
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleExportToExcelAward}
                        style={{ margin: "20px 0 0 0" }}
                        sx={{
                          backgroundColor: "#388E3C",
                          color: "##e0e0e0",
                          margin: "0 20px",
                          "&:hover": {
                            backgroundColor: "#45A049",
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center">
                          <FileDownloadOutlinedIcon />
                        </Box>
                      </Button>
                    </Box>
                    {/*BOX AND GRID LATER */}
                    <Box
                      m="10px 0 0 0"
                      height="70vh"
                      width="63vw"
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
                      {awLoading ? (
                        <CircularProgress />
                      ) : awError ? (
                        <Typography variant="h6" color="error">
                          Failed to load AWARD data: {lcError.message}
                        </Typography>
                      ) : (
                        <DataGrid
                          rows={award || []} // Ensure rows is always an array
                          columns={awardColumns}
                          components={{ Toolbar: GridToolbar }}
                          getRowId={(row) => row._id}
                        />
                      )}
                    </Box>
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </StyledCard>

          {/*===============DIALOG FOR LEARNING DEVELOPMENT START=================*/}
          <Dialog
            open={deleteDialogOpen}
            onClose={handleDeleteDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Learning Development?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteDialogClose}
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
            <DialogTitle>Edit Learning Development</DialogTitle>
            <DialogContent>
              {currentLD ? (
                <>
                  <TextField
                    margin="dense"
                    label="Training Title"
                    name="trainingTitle"
                    type="text"
                    value={currentLD.trainingTitle}
                    onChange={handleEditInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Date Started"
                    name="dateStart"
                    value={currentLD.dateStart}
                    onChange={handleEditInputChange}
                    fullWidth
                    type="date"
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Date Ended"
                    name="dateEnd"
                    value={currentLD.dateEnd}
                    onChange={handleEditInputChange}
                    fullWidth
                    type="date"
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="No of Hours"
                    name="numberOfHours"
                    value={currentLD.numberOfHours}
                    onChange={handleEditInputChange}
                    fullWidth
                    type="number"
                    variant="outlined"
                  />

                  <TextField
                    margin="dense"
                    label="No of Hours"
                    name="ldType"
                    value={currentLD.ldType}
                    onChange={handleEditInputChange}
                    fullWidth
                    type="text"
                    variant="outlined"
                  />

                  <TextField
                    margin="dense"
                    label="Venue"
                    name="venue"
                    value={currentLD.venue}
                    onChange={handleEditInputChange}
                    fullWidth
                    type="text"
                    variant="outlined"
                  />

                  <TextField
                    margin="dense"
                    name="sponsoredBy"
                    label="Conducted/Sponsored By"
                    type="text"
                    fullWidth
                    value={currentLD.sponsoredBy}
                    onChange={handleEditInputChange}
                    variant="outlined"
                  />
                </>
              ) : (
                <Typography variant="body1" color="error">
                  No learning development selected.
                </Typography>
              )}
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
            <DialogTitle>Add New Learning Development</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Training Title"
                name="trainingTitle"
                value={newLDData.trainingTitle}
                onChange={handleAddInputChange}
                fullWidth
                type="text"
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                label="Date Started"
                name="dateStart"
                value={newLDData.dateStart}
                onChange={handleAddInputChange}
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{
                  "& .Mui-focused": {
                    color: "#b4b4b4",
                  },
                }}
              />
              <TextField
                margin="dense"
                label="Date Ended"
                name="dateEnd"
                value={newLDData.dateEnd}
                onChange={handleAddInputChange}
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{
                  "& .Mui-focused": {
                    color: "#b4b4b4",
                  },
                }}
              />
              <TextField
                margin="dense"
                label="No. of Hours"
                name="numberOfHours"
                value={newLDData.numberOfHours}
                onChange={handleAddInputChange}
                fullWidth
                type="number"
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                name="ldType"
                label="Type of Learning Development"
                type="text"
                fullWidth
                value={newLDData.ldType}
                onChange={handleAddInputChange}
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                name="venue"
                label="Venue"
                type="text"
                fullWidth
                value={newLDData.venue}
                onChange={handleAddInputChange}
                variant="outlined"
                required
              />
              <TextField
                margin="dense"
                name="sponsoredBy"
                label="Conducted/Sponsored By"
                type="text"
                fullWidth
                value={newLDData.sponsoredBy}
                onChange={handleAddInputChange}
                variant="outlined"
                required
              />
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
          {/*===============DIALOG FOR LEARNING DEVELOPMENT END=================*/}

          {/*===============DIALOG FOR LEAVE RECORD START========================*/}
          <Dialog
            open={deleteLrDialogOpen}
            onClose={handleDeleteLrDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Leave Record?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteLrDialogClose}
                color="primary"
                disabled={deleteLrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteLR}
                color="error"
                disabled={deleteLrLoading}
              >
                {deleteLrLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={editLrDialogOpen}
            onClose={handleEditLrDialogClose}
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
            <DialogTitle>Edit Leave Record</DialogTitle>
            <DialogContent>
              {currentLR ? (
                <>
                  <TextField
                    margin="dense"
                    label="Period"
                    name="period"
                    type="text"
                    value={currentLR.period}
                    onChange={handleEditLrInputChange}
                    fullWidth
                    variant="outlined"
                  />

                  <FormControl margin="dense" fullWidth variant="outlined">
                    <InputLabel id="type-of-leave-label">
                      Particulars
                    </InputLabel>
                    <Select
                      labelId="type-of-leave-label"
                      id="type-of-leave"
                      label="Particulars"
                      name="particular"
                      value={currentLR.particular}
                      onChange={handleEditLrInputChange}
                    >
                      {!leaveTypeLoading &&
                        !leaveTypeError &&
                        leaveType.map((leave) => (
                          <MenuItem key={leave._id} value={leave.leaveType}>
                            {leave.leaveType}
                          </MenuItem>
                        ))}
                      ;
                    </Select>
                  </FormControl>

                  <TextField
                    margin="dense"
                    label="Earned"
                    name="earned"
                    type="text"
                    value={currentLR.earned}
                    onChange={handleEditLrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Absent Under With Pay"
                    name="absentUnderWithPay"
                    type="text"
                    value={currentLR.absentUnderWithPay}
                    onChange={handleEditLrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Balance"
                    name="balance"
                    type="text"
                    value={currentLR.balance}
                    onChange={handleEditLrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Absent Under Without Pay"
                    name="absentUnderWithoutPay"
                    type="text"
                    value={currentLR.absentUnderWithoutPay}
                    onChange={handleEditLrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Date Taken on Application for Leave"
                    name="dateTakenOnForLeave"
                    value={currentLR.dateTakenOnForLeave}
                    onChange={handleEditLrInputChange}
                    fullWidth
                    type="date"
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    name="actionTakenOnForLeave"
                    label="Action Taken on Application for Leave"
                    type="text"
                    fullWidth
                    value={currentLR.actionTakenOnForLeave}
                    onChange={handleEditLrInputChange}
                    variant="outlined"
                  />
                </>
              ) : (
                <Typography variant="body1" color="error">
                  No leave record selected.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleEditLrDialogClose}
                color="primary"
                disabled={updateLrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmEditLR}
                color="error"
                disabled={updateLrLoading}
              >
                {updateLrLoading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addLrDialogOpen}
            onClose={handleAddLrDialogClose}
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
            <DialogTitle>Add New Leave Record</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Period"
                name="period"
                type="text"
                value={newLRData.period}
                onChange={handleAddLrInputChange}
                fullWidth
                variant="outlined"
              />

              <FormControl margin="dense" fullWidth variant="outlined">
                <InputLabel id="type-of-leave-label">Particulars</InputLabel>
                <Select
                  labelId="type-of-leave-label"
                  id="type-of-leave"
                  label="Particulars"
                  name="particular"
                  value={newLRData.particular}
                  onChange={handleAddLrInputChange}
                >
                  {!leaveTypeLoading &&
                    !leaveTypeError &&
                    leaveType.map((leave) => (
                      <MenuItem key={leave._id} value={leave.leaveType}>
                        {leave.leaveType}
                      </MenuItem>
                    ))}
                  ;
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                label="Earned"
                name="earned"
                type="text"
                value={newLRData.earned}
                onChange={handleAddLrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Absent Under With Pay"
                name="absentUnderWithPay"
                type="text"
                value={newLRData.absentUnderWithPay}
                onChange={handleAddLrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Balance"
                name="balance"
                type="text"
                value={newLRData.balance}
                onChange={handleAddLrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Absent Under Without Pay"
                name="absentUnderWithoutPay"
                type="text"
                value={newLRData.absentUnderWithoutPay}
                onChange={handleAddLrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Date Taken on Application for Leave"
                name="dateTakenOnForLeave"
                value={newLRData.dateTakenOnForLeave}
                onChange={handleAddLrInputChange}
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{
                  "& .Mui-focused": {
                    color: "#b4b4b4",
                  },
                }}
              />
              <TextField
                margin="dense"
                name="actionTakenOnForLeave"
                label="Action Taken on Application for Leave"
                type="text"
                fullWidth
                value={newLRData.actionTakenOnForLeave}
                onChange={handleAddLrInputChange}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddLrDialogClose}
                color="primary"
                disabled={addLrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAddLR}
                color="error"
                disabled={addLrLoading}
              >
                {addLrLoading ? "Adding..." : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          {/*===============DIALOG FOR LEAVE RECORD END========================*/}

          {/*===============DIALOG FOR SERVICE RECORD START====================*/}
          <Dialog
            open={deleteSrDialogOpen}
            onClose={handleDeleteSrDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Service Record?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteSrDialogClose}
                color="primary"
                disabled={deleteSrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteSR}
                color="error"
                disabled={deleteSrLoading}
              >
                {deleteSrLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={editSrDialogOpen}
            onClose={handleEditSrDialogClose}
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
            <DialogTitle>Edit Service Record</DialogTitle>
            <DialogContent>
              {currentSR ? (
                <>
                  <TextField
                    margin="dense"
                    label="Inclusive Date From"
                    name="inclusiveDateFrom"
                    value={currentSR.inclusiveDateFrom}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    type="date"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                    sx={{
                      "& .Mui-focused": {
                        color: "#b4b4b4",
                      },
                    }}
                  />
                  <TextField
                    margin="dense"
                    label="Inclusive Date To"
                    name="inclusiveDateTo"
                    value={currentSR.inclusiveDateTo}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    type="date"
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Designation"
                    name="designation"
                    type="text"
                    value={currentSR.designation}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Status"
                    name="status"
                    type="text"
                    value={currentSR.status}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Salary"
                    name="salary"
                    type="text"
                    value={currentSR.salary}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Station/Place"
                    name="station"
                    type="text"
                    value={currentSR.station}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Branch"
                    name="branch"
                    type="text"
                    value={currentSR.branch}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="W/PAY"
                    name="wPay"
                    type="text"
                    value={currentSR.wPay}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Separation Date"
                    name="separationDate"
                    value={currentSR.separationDate}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    type="date"
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Separation Cause"
                    name="separationCause"
                    type="text"
                    value={currentSR.separationCause}
                    onChange={handleEditSrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </>
              ) : (
                <Typography variant="body1" color="error">
                  No service record selected.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleEditSrDialogClose}
                color="primary"
                disabled={updateSrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmEditSR}
                color="error"
                disabled={updateSrLoading}
              >
                {updateSrLoading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addSrDialogOpen}
            onClose={handleAddSrDialogClose}
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
            <DialogTitle>Add New Service Record</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Inclusive Date From"
                name="inclusiveDateFrom"
                value={newSRData.inclusiveDateFrom}
                onChange={handleAddSrInputChange}
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{
                  "& .Mui-focused": {
                    color: "#b4b4b4",
                  },
                }}
              />
              <TextField
                margin="dense"
                label="Inclusive Date To"
                name="inclusiveDateTo"
                value={newSRData.inclusiveDateTo}
                onChange={handleAddSrInputChange}
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{
                  "& .Mui-focused": {
                    color: "#b4b4b4",
                  },
                }}
              />
              <TextField
                margin="dense"
                label="Designation"
                name="designation"
                type="text"
                value={newSRData.designation}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Status"
                name="status"
                type="text"
                value={newSRData.status}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Salary"
                name="salary"
                type="text"
                value={newSRData.salary}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Station/Place"
                name="station"
                type="text"
                value={newSRData.station}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Branch"
                name="branch"
                type="text"
                value={newSRData.branch}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="W/PAY"
                name="wPay"
                type="text"
                value={newSRData.wPay}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Separation Date"
                name="separationDate"
                value={newSRData.separationDate}
                onChange={handleAddSrInputChange}
                fullWidth
                type="date"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                // required
                sx={{
                  "& .Mui-focused": {
                    color: "#b4b4b4",
                  },
                }}
              />
              <TextField
                margin="dense"
                label="Separation Cause"
                name="separationCause"
                type="text"
                value={newSRData.separationCause}
                onChange={handleAddSrInputChange}
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddSrDialogClose}
                color="primary"
                disabled={addSrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAddSR}
                color="error"
                disabled={addSrLoading}
              >
                {addSrLoading ? "Adding..." : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          {/*===============DIALOG FOR SERVICE RECORD END========================*/}

          {/*===============DIALOG FOR PERFORMANCE RATING START====================*/}
          <Dialog
            open={deletePrDialogOpen}
            onClose={handleDeletePrDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Performance Rating?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeletePrDialogClose}
                color="primary"
                disabled={deletePrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeletePR}
                color="error"
                disabled={deletePrLoading}
              >
                {deletePrLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={editPrDialogOpen}
            onClose={handleEditPrDialogClose}
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
            <DialogTitle>Edit Performance Rating</DialogTitle>
            <DialogContent>
              {currentPR ? (
                <>
                  <TextField
                    margin="dense"
                    label="Semester"
                    name="semester"
                    type="text"
                    value={currentPR.semester}
                    onChange={handleEditPrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Year"
                    name="year"
                    type="text"
                    value={currentPR.year}
                    onChange={handleEditPrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Numerical Rating"
                    name="numericalRating"
                    type="text"
                    value={currentPR.numericalRating}
                    onChange={handleEditPrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="Adjectival Rating"
                    name="adjectivalRating"
                    type="text"
                    value={currentPR.adjectivalRating}
                    onChange={handleEditPrInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </>
              ) : (
                <Typography variant="body1" color="error">
                  No service record selected.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleEditPrDialogClose}
                color="primary"
                disabled={updatePrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmEditPR}
                color="error"
                disabled={updatePrLoading}
              >
                {updatePrLoading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addPrDialogOpen}
            onClose={handleAddPrDialogClose}
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
            <DialogTitle>Add New Performance Rating</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Semester"
                name="semester"
                type="text"
                value={newPRData.semester}
                onChange={handleAddPrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Year"
                name="year"
                type="text"
                value={newPRData.year}
                onChange={handleAddPrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Numerical Rating"
                name="numericalRating"
                type="text"
                value={newPRData.numericalRating}
                onChange={handleAddPrInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="Adjectival Rating"
                name="adjectivalRating"
                type="text"
                value={newPRData.adjectivalRating}
                onChange={handleAddPrInputChange}
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddPrDialogClose}
                color="primary"
                disabled={addPrLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAddPR}
                color="error"
                disabled={addPrLoading}
              >
                {addPrLoading ? "Adding..." : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          {/*===============DIALOG FOR PERFORMANCE RATING END========================*/}


          {/*===============AWARDS START========================*/}
          <Dialog
            open={deleteAwDialogOpen}
            onClose={handleDeleteAwDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Award?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteAwDialogClose}
                color="primary"
                disabled={deleteAwLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDeleteAW}
                color="error"
                disabled={deleteAwLoading}
              >
                {deleteAwLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={editAwDialogOpen}
            onClose={handleEditAwDialogClose}
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
            <DialogTitle>Edit Award</DialogTitle>
            <DialogContent>
              {currentAW ? (
                <>
                  <TextField
                    margin="dense"
                    label="Name of Award"
                    name="nameOfAward"
                    type="text"
                    value={currentAW.nameOfAward}
                    onChange={handleEditAwInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    select
                    margin="dense"
                    label="Level of Award"
                    name="levelOfAward"
                    type="text"
                    value={currentAW.levelOfAward}
                    onChange={handleEditAwInputChange}
                    fullWidth
                    variant="outlined"
                    SelectProps={{ native: true }}
                  >
                    <option value="International">International</option>
                    <option value="National">National</option>
                    <option value="Regional">Regional</option>
                    <option value="Provincial">Provincial</option>
                    <option value="Municipal">Municipal</option>
                  </TextField>
                  <TextField
                    margin="dense"
                    label="Date of Award"
                    name="dateOfAward"
                    type="date"
                    value={currentAW.dateOfAward}
                    onChange={handleEditAwInputChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    margin="dense"
                    label="ISSUED BY"
                    name="issuedBy"
                    type="text"
                    value={currentAW.issuedBy}
                    onChange={handleEditAwInputChange}
                    fullWidth
                    variant="outlined"
                  />
                </>
              ) : (
                <Typography variant="body1" color="error">
                  No award selected.
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleEditAwDialogClose}
                color="primary"
                disabled={updateAwLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmEditAW}
                color="error"
                disabled={updateAwLoading}
              >
                {updateAwLoading ? "Updating..." : "Update"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addAwDialogOpen}
            onClose={handleAddAwDialogClose}
            aria-labelledby="form-dialog-title"
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: {
                minHeight: "40vh",
                maxHeight: "40vh",
                minWidth: "80vh",
                maxWidth: "80vh",
              },
            }}
          >
            <DialogTitle>Add New Award</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Name of Award"
                name="nameOfAward"
                type="text"
                value={newAWData.nameOfAward}
                onChange={handleAddAwInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                select
                margin="dense"
                label="Level of Award"
                name="levelOfAward"
                type="text"
                value={newAWData.levelOfAward}
                onChange={handleAddAwInputChange}
                fullWidth
                variant="outlined"
                SelectProps={{ native: true }}
              >
                <option value="International">International</option>
                <option value="National">National</option>
                <option value="Regional">Regional</option>
                <option value="Provincial">Provincial</option>
                <option value="Municipal">Municipal</option>
              </TextField>
              <TextField
                margin="dense"
                label="Date of Award"
                name="dateOfAward"
                type="date"
                value={newAWData.dateOfAward}
                onChange={handleAddAwInputChange}
                fullWidth
                variant="outlined"
              />
              <TextField
                margin="dense"
                label="ISSUED BY"
                name="issuedBy"
                type="text"
                value={newAWData.issuedBy}
                onChange={handleAddAwInputChange}
                fullWidth
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleAddAwDialogClose}
                color="primary"
                disabled={addAwLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAddAW}
                color="error"
                disabled={addAwLoading}
              >
                {addAwLoading ? "Adding..." : "Add"}
              </Button>
            </DialogActions>
          </Dialog>
          {/*===============AWARDS END========================*/}
        </Box>
      </Box>
    </Wrapper>
  );
};

export default EmployeeDetails;
