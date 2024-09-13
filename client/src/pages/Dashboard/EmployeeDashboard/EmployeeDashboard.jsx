import {
  Avatar,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Timeline,
  Upload,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Radio,
  message,
} from "antd";
import { Grid, Box } from "@mui/material";
import { EditOutlined } from "@ant-design/icons";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useAuth } from "../../../contexts/AuthContext";
import { format } from "date-fns";
import styled from "styled-components";
import useUploadAvatar from "../../../hooks/UserHook/useUploadAvatar";
import useUploadSignature from "../../../hooks/UserHook/useUploadSignature";
import useAddLeaveRequest from "../../../hooks/LeaveRequestHook/useAddLeaveRequest";
import useFetchLeaveType from "../../../hooks/LeaveTypeHook/useFetchLeaveType";
import useAddRequestForm from "../../../hooks/RequestFormHook/useAddRequestForm";
import useFetchUserById from "../../../hooks/UserHook/useFetchUserById";

import Footer from "../../global/Footer";
import { useState, useEffect } from "react";

const { Title, Text, Paragraph } = Typography;

const StyledCard = styled(Card)`
  margin: 100px;
  background: none;
  border: none;

  @media (max-width: 780px) {
    margin: 2px;
  }
`;

const BoldText = styled.span`
  font-weight: bold;
`;

const Wrapper = styled.div`
  font-family: "Montserrat", sans-serif;
`;

// Styled DatePicker to ensure full width
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const EmployeeDashboard = () => {
  const theme = useTheme();
  const [form] = Form.useForm();
  const colors = tokens(theme.palette.mode);
  const { userData, updateUserData } = useAuth();
  const { leaveType } = useFetchLeaveType();
  const { userData: fetchedUserData } = useFetchUserById(userData?._id);

  const { addRequestForm } = useAddRequestForm();

  const { uploadAvatar, loading } = useUploadAvatar(
    userData._id,
    (newAvatarUrl) => setAvatarUrl(newAvatarUrl)
  );

  const { uploadSignature, loading: signatureLoading } = useUploadSignature(
    userData._id,
    (newSignatureUrl) => setSignatureUrl(newSignatureUrl)
  );

  const [avatarUrl, setAvatarUrl] = useState(userData.avatar || "");
  const [signatureUrl, setSignatureUrl] = useState(userData.signature || "");

  // State for Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRequestFormModalVisible, setIsRequestFormModalVisible] =
    useState(false);
  const [isServiceRecordModalVisible, setIsServiceRecordModalVisible] =
    useState(false);
  const [isPerformanceRatingModalVisible, setIsPerformanceRatingModalVisible] =
    useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [isSalaryOptionModalVisible, setIsSalaryOptionModalVisible] =
    useState(false);
  const [selectedSalaryOption, setSelectedSalaryOption] = useState(null);
  const [serviceRecordDates, setServiceRecordDates] = useState({
    from: null,
    to: null,
  });
  const [performanceRatingDates, setPerformanceRatingDates] = useState({
    from: null,
    to: null,
  });

  const [
    isCustomCertificationModalVisible,
    setIsCustomCertificationModalVisible,
  ] = useState(false);
  const [customCertification, setCustomCertification] = useState("");

  // Integrate the useAddLeaveRequest hook
  const {
    addLeaveRequest,
    loading: leaveLoading,
    error: leaveError,
  } = useAddLeaveRequest();

  const handleAvatarUpload = async (file) => {
    try {
      const data = await uploadAvatar(file);
      setAvatarUrl(data.avatarUrl);

      // Update user data with the new avatar URL
      updateUserData({ ...userData, avatar: data.avatarUrl });
    } catch (error) {
      message.error(error.message);
    }
  };
  // Update avatarUrl when userData changes
  useEffect(() => {
    if (fetchedUserData) {
      setAvatarUrl(fetchedUserData.avatar);
      setSignatureUrl(fetchedUserData.signature);
    }
  }, [fetchedUserData]);

  const handleSignatureUpload = async (file) => {
    try {
      const data = await uploadSignature(file);
      setSignatureUrl(data.signatureUrl);

      // Update user data with the new signature URL
      updateUserData({ ...userData, signature: data.signatureUrl });
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleLeaveRequest = async (values) => {
    const leaveRequestData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      middleName: userData.middleName,
      suffix: userData.suffix,
      gmail: userData.email,
      position: userData.positionTitle,
      department: userData.officeAssignment,
      salary: userData.salary,
      signature: userData.signature,

      leaveType: values.leaveType,
      otherLeaveType: values.otherLeaveType,
      vacationSpecialLeave: values.vacationSpecialLeave,
      vacationSpecialLeaveAddress: values.vacationSpecialLeaveAddress,
      sickLeave: values.sickLeave,
      sickLeaveIllness: values.sickLeaveIllness,
      womanSpecialLeave: values.womanSpecialLeave,
      studyLeave: values.studyLeave,
      otherPurpose: values.otherPurpose,
      numberOfWorkDays: values.numberOfWorkDays,
      commutation: values.commutation,

      startDate: values.startDate,
      endDate: values.endDate,
    };

    try {
      const newLeaveRequest = await addLeaveRequest(leaveRequestData);

      if (newLeaveRequest) {
        form.resetFields();
        setIsModalVisible(false); // Close the modal on success
      }
    } catch (error) {
      message.error("Failed to submit leave request");
    }
  };

  //Employment Certification request
  const handleCertificationRequest = async (values) => {
    const certificationData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      middleName: userData.middleName,
      suffix: userData.suffix,
      dateOfBirth: userData.dateOfBirth,
      gmail: userData.email,
      position: userData.positionTitle,
      department: userData.officeAssignment,
      employmentType: values.employmentType,
      certificationType: values.certificationType, // Certification type from the form
      salaryOption: values.salaryOption,
      dateFrom: values.dateFrom,
      dateTo: values.dateTo,
      purpose: values.purpose, // Reason from the form
    };

    try {
      const newCertificationRequest = await addRequestForm(certificationData);
      if (newCertificationRequest) {
        message.success("Certification request submitted successfully");
        setIsRequestFormModalVisible(false); // Close the modal on success
        form.resetFields();
      }
    } catch (error) {
      message.error("Failed to submit certification request");
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleAvatarUpload(file);
      return false; // Prevent automatic upload
    },
  };

  const uploadSignatureProps = {
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await handleSignatureUpload(file);
        onSuccess();
      } catch (error) {
        onError(error);
      }
    },
  };

  // Modal Handlers
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Modals for requestForm
  const handleCertificationChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCertification(selectedValue);

    if (selectedValue === "certificateOfEmployment") {
      setIsSalaryOptionModalVisible(true);
    } else if (selectedValue === "serviceRecord") {
      setIsServiceRecordModalVisible(true);
    } else if (selectedValue === "certificateOfRating") {
      setIsPerformanceRatingModalVisible(true);
    } else if (selectedValue === "otherTypesOfCertification") {
      setIsCustomCertificationModalVisible(true);
    } else {
      setSelectedSalaryOption(null); // Reset salary option if another certification is selected
    }
  };

  //Service Record
  const handleServiceRecordDateChange = (date, type) => {
    setServiceRecordDates((prevDates) => ({
      ...prevDates,
      [type]: date ? date.format("MM DD, YYYY") : null,
    }));
  };

  const handleServiceRecordOk = () => {
    console.log("Service Record Date Range:", serviceRecordDates);
    setIsServiceRecordModalVisible(false);
  };

  //Performance Rating
  const handlePerformanceRatingDateChange = (date, type) => {
    setPerformanceRatingDates((prevDates) => ({
      ...prevDates,
      [type]: date ? date.format("MM DD, YYYY") : null,
    }));
  };

  const handlePerformanceRatingOk = () => {
    setIsPerformanceRatingModalVisible(false);
  };

  const handleSalaryOptionChange = (e) => {
    setSelectedSalaryOption(e.target.value);
  };

  const handleSalaryOptionOk = () => {
    if (!selectedSalaryOption) {
      message.warning("Please select a salary option before proceeding.");
      return;
    }
    setIsSalaryOptionModalVisible(false);
  };

  const requestFormShowModal = () => {
    setIsRequestFormModalVisible(true);
  };

  //Request Form Handle Ok
  const requestFormHandleOk = () => {
    form.validateFields().then((values) => {
      // Validation for service record date range
      if (
        selectedCertification === "serviceRecord" &&
        (!serviceRecordDates.from || !serviceRecordDates.to)
      ) {
        message.warning(
          "Please select a valid date range for the service record."
        );
        return;
      }

      // Validation for performance rating date range
      if (
        selectedCertification === "certificateOfRating" &&
        (!performanceRatingDates.from || !performanceRatingDates.to)
      ) {
        message.warning(
          "Please select a valid date range for the performance rating."
        );
        return;
      }

      // Validation for custom certification input
      if (
        selectedCertification === "otherTypesOfCertification" &&
        !customCertification
      ) {
        message.warning("Please specify the type of certification.");
        setIsCustomCertificationModalVisible(true);
        return;
      }

      // Include salary option if applicable
      if (selectedCertification === "certificateOfEmployment") {
        values.salaryOption = selectedSalaryOption;
      }

      // Validation for salary option when Certificate of Employment is selected
      if (
        selectedCertification === "certificateOfEmployment" &&
        !selectedSalaryOption
      ) {
        message.warning("Please select a salary option.");
        setIsSalaryOptionModalVisible(true); // Show the salary option modal again
        return;
      }

      // Include date range if applicable
      if (selectedCertification === "serviceRecord") {
        values.dateFrom = serviceRecordDates.from;
        values.dateTo = serviceRecordDates.to;
      }

      if (selectedCertification === "certificateOfRating") {
        values.dateFrom = performanceRatingDates.from;
        values.dateTo = performanceRatingDates.to;
      }

      // Include custom certification if applicable
      if (selectedCertification === "otherTypesOfCertification") {
        values.certificationType = customCertification;
      }

      handleCertificationRequest(values);
      setIsRequestFormModalVisible(false); // Close the modal on success
      form.resetFields();
    });
  };

  const requestFormHandleCancel = () => {
    setIsRequestFormModalVisible(false);
    form.resetFields();
    setSelectedSalaryOption(null);
    setServiceRecordDates({ from: null, to: null }); // Reset service record dates
    setPerformanceRatingDates({ from: null, to: null }); // Reset performance rating dates
    setCustomCertification(""); // Reset custom certification input
  };

  //==========================LEAVE CONDITIONS===============================
  const [isOtherLeaveSelected, setIsOtherLeaveSelected] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  // State to track if input has been entered in the womanSpecialLeave text area
  const [isWomanSpecialLeaveTyped, setIsWomanSpecialLeaveTyped] =
    useState(false);

  //==========Sick Leave Radio Button============
  const [isSickLeaveSelected, setIsSickLeaveSelected] = useState(false);
  const handleSickLeaveChange = (e) => {
    // Check if any radio button is selected
    setIsSickLeaveSelected(!!e.target.value);
    setSelectedLeaveType("sickLeave");
    setIsOtherLeaveSelected(true);
  };
  //==========Vacation/Special Privilege Leave Radio Button============
  const [isVacationSpecialLeaveSelected, setIsVacationSpecialLeaveSelected] =
    useState(false);
  const handleVacationSpecialLeaveChange = (e) => {
    // Check if any radio button is selected
    setIsVacationSpecialLeaveSelected(!!e.target.value);
    setSelectedLeaveType("vacationSpecialLeave");
    setIsOtherLeaveSelected(true);
  };

  const handleStudyLeaveChange = () => {
    setSelectedLeaveType("studyLeave");
    setIsOtherLeaveSelected(true);
  };

  const handleOtherPurposeChange = () => {
    setSelectedLeaveType("otherPurpose");
    setIsOtherLeaveSelected(true);
  };

  const handleWomanSpecialLeaveChange = (e) => {
    setIsWomanSpecialLeaveTyped(!!e.target.value);
  };

  //=================LEARNING AND DEVELOPMENT COLUMNS START=======================//
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
  ];
  //=================LEARNING AND DEVELOPMENT COLUMNS END=======================//

  //========================LEAVE RECORD COLUMNS START==========================//
  const leaveRecordColumns = [
    { field: "period", headerName: "PERIOD", width: 150 },
    { field: "particular", headerName: "PARTICULARS", width: 200 },
    { field: "typeOfLeave", headerName: "TYPE OF LEAVE", width: 200 },
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
      headerName: "ACTION TAKEN ON APPLICATION FOR LEAVE",
      width: 280,
    },
  ];
  //========================LEAVE RECORD COLUMNS END==========================//

  //========================SERVICE RECORD COLUMNS START========================//
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
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "separationCause",
      headerName: "SEPARATION CAUSE",
      width: 200,
    },
  ];
  //========================SERVICE RECORD COLUMNS END========================//
  //========================PERFORMANCE START========================//
  const performanceRatingColumns = [
    { field: "semester", headerName: "SEMESTER", width: 300 },
    { field: "year", headerName: "YEAR", width: 300 },
    { field: "numericalRating", headerName: "NUMERICAL RATING", width: 300 },
    { field: "adjectivalRating", headerName: "ADJECTIVAL RATING", width: 310 },
  ];
  //========================PERFORMANCE RATING COLUMNS END========================//
  //========================PERFORMANCE START========================//
  const leaveCreditColumns = [
    { field: "leaveType", headerName: "LEAVE TYPE", width: 600 },
    { field: "credit", headerName: "CREDITS", width: 600 },
  ];
  //========================PERFORMANCE RATING COLUMNS END========================//
  
  
  return (
    <Wrapper>
      <StyledCard>
        <Card>
          <Row gutter={[32, 32]} align="center">
            <Col xs={24} sm={24} md={8} lg={6} style={{ textAlign: "center" }}>
              <Avatar size={180} src={avatarUrl} />
              <Upload {...uploadProps} showUploadList={false}>
                <Button
                  type="primary"
                  loading={loading}
                  style={{ margin: "20px" }}
                >
                  Change Profile
                </Button>
              </Upload>
            </Col>
            <Col xs={24} sm={24} md={16} lg={18}>
              <Title level={3}>
                {userData.lastName}, {userData.firstName}, {userData.middleName}
              </Title>
              <Text>{userData.officeAssignment}</Text>
              <Paragraph>
                <BoldText>{userData.positionTitle}</BoldText>
              </Paragraph>
              <Paragraph>
                <strong>Employee ID:</strong> {userData.employeeId}
              </Paragraph>
              <Paragraph>
                <strong>Hired Date:</strong> {userData.hiredDate}
              </Paragraph>
              <Paragraph>
                <strong>Reports To:</strong> {userData.reportTo}
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Button type="primary" block onClick={showModal}>
                Apply for Leave
              </Button>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Button
                icon={<EditOutlined />}
                block
                onClick={requestFormShowModal}
              >
                Request Form
              </Button>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: "30px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <BoldText>PERSONAL INFORMATION</BoldText>
              </Title>
              <Paragraph>
                <strong>Last Name:</strong> {userData.lastName}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>First Name:</strong> {userData.firstName}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Middle Name:</strong> {userData.middleName}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Suffix (Jr., II, III, IV):</strong> {userData.suffix}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Sex:</strong> {userData.gender}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Date of Birth (MM/DD/YYYY):</strong>{" "}
                {userData.dateOfBirth}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Blood Type:</strong> {userData.bloodType}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Civil Status:</strong> {userData.civilStatus}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Date of Separation:</strong> {userData.dateOfSeparation}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Cause of Separation:</strong>{" "}
                {userData.causeOfSeparation}
                <br />
              </Paragraph>

              <Paragraph>
                <strong>DIGITAL SIGNATURE:</strong>{" "}
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={6}
                  style={{ textAlign: "center" }}
                >
                  <Avatar
                    src={signatureUrl}
                    style={{
                      width: "250px",
                      height: "120px",
                      borderRadius: "8px",
                      objectFit: "cover",
                      background: "#bfbfbf",
                      color: "#ffffff",
                      marginTop: "5px",
                    }}
                  />
                  <Upload {...uploadSignatureProps} showUploadList={false}>
                    <Button
                      type="primary"
                      loading={signatureLoading}
                      style={{
                        margin: "10px 0",
                        backgroundColor: "#E24036",
                        color: "#ffffff",
                      }}
                    >
                      Change Signature
                    </Button>
                  </Upload>
                </Col>
              </Paragraph>
            </Col>

            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <BoldText>EMPLOYMENT DETAILS</BoldText>
              </Title>
              <Paragraph>
                <strong>Employee ID:</strong> {userData.employeeId}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Hired Date:</strong> {userData.hiredDate}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>First Day of Service:</strong>{" "}
                {userData.firstDayOfService}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Office Assignment:</strong> {userData.officeAssignment}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Reassignment:</strong> {userData.reAssignment}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Position Title:</strong> {userData.positionTitle}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Position Level:</strong> {userData.positionLevel}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Employment Status:</strong> {userData.employmentStatus}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Status of Current Employment:</strong>{" "}
                {userData.statusOfCurrentEmployment}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Role:</strong> {userData.role}
                <br />
              </Paragraph>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: "30px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <BoldText>CONTACT INFORMATION</BoldText>
              </Title>
              <Paragraph>
                <strong>Email:</strong> {userData.email}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Employee Contact Number:</strong>{" "}
                {userData.contactNumber}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>In case of emergency, Contact Name:</strong>{" "}
                {userData.emergencyContactName}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>In case of emergency, Contact Number:</strong>{" "}
                {userData.emergencyContact}
                <br />
              </Paragraph>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: "30px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <BoldText>SALARY AND PROMOTION</BoldText>
              </Title>
              <Paragraph>
                <strong>Salary Grade:</strong> {userData.salaryGrade}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Salary:</strong> {userData.salary}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Step Increment:</strong> {userData.stepIncrement}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>Date of Last Promotion (MM/DD/YYYY):</strong>{" "}
                {userData.dateOfLastPromotion}
                <br />
              </Paragraph>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: "30px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <BoldText>Government IDs</BoldText>
              </Title>
              <Paragraph>
                <strong>TIN Number:</strong> {userData.tin}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>GSIS Number:</strong> {userData.gsis}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>PAG-IBIG Number:</strong> {userData.pagIbig}
                <br />
              </Paragraph>
              <Paragraph>
                <strong>PhilHealth Number:</strong> {userData.philHealth}
                <br />
              </Paragraph>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginTop: "30px" }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <BoldText>EDUCATIONAL BACKGROUND</BoldText>
              </Title>
              <Paragraph>
                <strong style={{ fontSize: "20px", fontStyle: "italic" }}>
                  {userData.educationalBackground}
                </strong>
                <br />
              </Paragraph>
            </Col>

            <Col xs={24} md={12}>
              <Title level={3} style={{ marginBottom: "16px" }}>
                <strong>ELIGIBILITY/IES</strong>
              </Title>
              <Timeline>
                {userData.employeeEligibilities.map((eligibility, index) => (
                  <Timeline.Item key={index}>{eligibility}</Timeline.Item>
                ))}
              </Timeline>
            </Col>
          </Row>
        </Card>

        <Card variant="outlined" style={{ marginTop: "30px" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                <Title level={3} style={{ marginBottom: "16px" }}>
                  <BoldText>LEARNING & DEVELOPMENT (LD)</BoldText>
                </Title>
                <Box
                  m="10px 0 0 0"
                  height="calc(90vh - 200px)" // Adjust this value as needed for responsiveness
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
                  <DataGrid
                    rows={userData.learningDevelopment || []}
                    columns={columns}
                    getRowId={(row) => row._id || row.id || Math.random()}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Card variant="outlined" style={{ marginTop: "30px" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                <Title level={3} style={{ marginBottom: "16px" }}>
                  <BoldText>LEAVE RECORD</BoldText>
                </Title>
                <Box
                  m="10px 0 0 0"
                  height="calc(90vh - 200px)" // Adjust this value as needed for responsiveness
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
                  <DataGrid
                    rows={userData.leaveRecord || []}
                    columns={leaveRecordColumns}
                    getRowId={(row) => row._id || row.id || Math.random()}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Card variant="outlined" style={{ marginTop: "30px" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                <Title level={3} style={{ marginBottom: "16px" }}>
                  <BoldText>SERVICE RECORD</BoldText>
                </Title>
                <Box
                  m="10px 0 0 0"
                  height="calc(90vh - 200px)" // Adjust this value as needed for responsiveness
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
                  <DataGrid
                    rows={userData.serviceRecord || []}
                    columns={serviceRecordColumns}
                    getRowId={(row) => row._id || row.id || Math.random()}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Card variant="outlined" style={{ marginTop: "30px" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                <Title level={3} style={{ marginBottom: "16px" }}>
                  <BoldText>PERFORMANCE RATING</BoldText>
                </Title>
                <Box
                  m="10px 0 0 0"
                  height="calc(80vh - 200px)" // Adjust this value as needed for responsiveness
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
                  <DataGrid
                    rows={userData.performanceRating || []}
                    columns={performanceRatingColumns}
                    getRowId={(row) => row._id || row.id || Math.random()}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Card>

        <Card variant="outlined" style={{ marginTop: "30px" }}>
          <Grid container>
            <Grid item xs={12} md={12}>
              <Typography variant="h4" sx={{ marginBottom: 2 }}>
                <Title level={3} style={{ marginBottom: "16px" }}>
                  <BoldText>LEAVE CREDITS</BoldText>
                </Title>
                <Box
                  m="10px 0 0 0"
                  height="calc(80vh - 200px)" // Adjust this value as needed for responsiveness
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
                  <DataGrid
                    rows={userData.leaveCredit || []}
                    columns={leaveCreditColumns}
                    getRowId={(row) => row._id || row.id || Math.random()}
                    components={{ Toolbar: GridToolbar }}
                  />
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/*========== Leave Application Modal=========== */}
        <Modal
          title="Apply for Leave"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            onFinish={handleLeaveRequest}
            layout="vertical"
            style={{ marginTop: "30px" }}
          >
            <BoldText>TYPE OF LEAVE TO BE AVAILED OF</BoldText>
            <Form.Item
              name="leaveType"
              label="Leave Type"
              // rules={[
              //   { required: true, message: "Please select a leave type" },
              // ]}
            >
              <Select placeholder="Select a leave type">
                {leaveType.map((type) => (
                  <select key={type._id} value={type.leaveType}>
                    {type.leaveType}
                  </select>
                ))}
                ;
              </Select>
            </Form.Item>

            <Form.Item
              name="otherLeaveType"
              label="Other Leave Type:"
              rules={[
                {
                  required: true,
                  message:
                    "Please provide other leave type or enter NONE if there isn't one",
                },
              ]}
            >
              <Input.TextArea rows={1} placeholder="Other leave type" />
            </Form.Item>

            <BoldText>DETAILS OF LEAVE</BoldText>
            <Form.Item
              name="vacationSpecialLeave"
              onChange={handleVacationSpecialLeaveChange}
              label="In case of Vacation/Special Privilege Leave:"
            >
              <Radio.Group
                disabled={
                  isWomanSpecialLeaveTyped ||
                  (selectedLeaveType &&
                    selectedLeaveType !== "vacationSpecialLeave")
                }
              >
                <Radio value="Within the Philippines">
                  Within in the Philippines
                </Radio>
                <Radio value="Abroad">Abroad</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="vacationSpecialLeaveAddress"
              label="Specify Address:"
              rules={[
                {
                  required: selectedLeaveType === "vacationSpecialLeave",
                  message: "Please provide the address",
                },
              ]}
            >
              <Input.TextArea
                rows={1}
                placeholder="Address..."
                disabled={!isVacationSpecialLeaveSelected}
              />
            </Form.Item>

            <Form.Item name="sickLeave" label="In case of Sick Leave:">
              <Radio.Group
                onChange={handleSickLeaveChange}
                disabled={
                  isWomanSpecialLeaveTyped ||
                  (selectedLeaveType && selectedLeaveType !== "sickLeave")
                }
              >
                <Radio value="In Hospital">In Hospital</Radio>
                <Radio value="Out Patient">Out Patient</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="sickLeaveIllness"
              label="Specify Illness:"
              rules={[
                {
                  required: isSickLeaveSelected,
                  message: "Please provide illness name",
                },
              ]}
            >
              <Input.TextArea
                rows={1}
                placeholder="Illness..."
                disabled={!isSickLeaveSelected}
              />
            </Form.Item>

            <Form.Item
              name="womanSpecialLeave"
              label="In case of Special Leave Benefits for Women:"
            >
              <Input.TextArea
                rows={1}
                placeholder="Specify Illness..."
                onChange={handleWomanSpecialLeaveChange}
                disabled={isOtherLeaveSelected}
              />
            </Form.Item>

            <Form.Item name="studyLeave" label="In case of Study Leave:">
              <Radio.Group
                onChange={handleStudyLeaveChange}
                disabled={
                  isWomanSpecialLeaveTyped ||
                  (selectedLeaveType && selectedLeaveType !== "studyLeave")
                }
              >
                <Radio value="Completion of Master's Degree">
                  Completion of Master's Degree
                </Radio>
                <Radio value="BAR/Board Examination Review">
                  BAR/Board Examination Review
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="otherPurpose" label="Other purpose:">
              <Radio.Group
                onChange={handleOtherPurposeChange}
                disabled={
                  isWomanSpecialLeaveTyped ||
                  (selectedLeaveType && selectedLeaveType !== "otherPurpose")
                }
              >
                <Radio value="Monetization of Leave Credits">
                  Monetization of Leave Credits
                </Radio>
                <Radio value="Terminal Leave">Terminal Leave</Radio>
              </Radio.Group>
            </Form.Item>

            <BoldText>NUMBER OF WORKING DAYS APPLIED FOR</BoldText>
            <Form.Item
              name="numberOfWorkDays"
              rules={[
                { required: true, message: "Please provide number of days" },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="No. of days..."
                style={{ width: "100%" }}
                parser={(value) => value.replace(/\D/g, "")}
              />
            </Form.Item>

            <BoldText>INCLUSIVE DATES</BoldText>
            <Form.Item>
              <Form.Item
                name="startDate"
                label="Start Date"
                rules={[
                  { required: true, message: "Please select a start date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="endDate"
                label="End Date"
                rules={[
                  { required: true, message: "Please select an end date" },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Form.Item>

            <BoldText>COMMUTATION</BoldText>
            <Form.Item
              name="commutation"
              rules={[
                {
                  required: true,
                  message: "Please select a commutation option",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="Not Requested">Not Requested</Radio>
                <Radio value="Requested">Requested</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item style={{ marginTop: "50px" }}>
              <Button type="primary" htmlType="submit" loading={leaveLoading}>
                Submit
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: "8px" }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Request Form Modal */}
        <Modal
          title="Human Resource Management Section - Request Form"
          visible={isRequestFormModalVisible}
          onOk={requestFormHandleOk}
          onCancel={requestFormHandleCancel}
          okText="Submit Request"
        >
          <Form layout="vertical" form={form}>
            <Form.Item
              label="Employment Type"
              name="employmentType"
              rules={[
                {
                  required: true,
                  message: "Please select the employment type",
                },
              ]}
            >
              <Radio.Group>
                <Radio value="jobOrder">Job Order</Radio>
                <Radio value="regular">Regular</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Certifications"
              name="certificationType"
              rules={[
                {
                  required: true,
                  message: "Please select a certification type",
                },
              ]}
            >
              <Radio.Group onChange={handleCertificationChange}>
                <Radio value="certificateOfEmployment">
                  Certificate of Employment
                </Radio>
                <Radio value="certificateOfRating">Certificate of Rating</Radio>
                <Radio value="loanCertification">Loan Certification</Radio>
                <Radio value="serviceRecord">Service Record</Radio>
                <Radio value="otherTypesOfCertification">
                  Other types of Certification
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label="Purpose"
              name="purpose"
              rules={[{ required: true, message: "Please input your purpose" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter the purpose of the request"
              />
            </Form.Item>
          </Form>
        </Modal>

        {/*ANOTHER POP UP*/}
        <Modal
          title="Salary Option"
          visible={isSalaryOptionModalVisible}
          onOk={handleSalaryOptionOk}
          onCancel={() => setIsSalaryOptionModalVisible(false)}
        >
          <Form.Item>
            <Radio.Group onChange={handleSalaryOptionChange}>
              <Radio value="withSalary">With Salary</Radio>
              <Radio value="withoutSalary">Without Salary</Radio>
            </Radio.Group>
          </Form.Item>
        </Modal>

        <Modal
          title="Service Record Date Range"
          visible={isServiceRecordModalVisible}
          onOk={handleServiceRecordOk}
          onCancel={() => setIsServiceRecordModalVisible(false)}
          centered
          bodyStyle={{ padding: "20px" }}
        >
          <Form layout="vertical">
            <Form.Item label="Service Record Date Range">
              <Input.Group compact>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item name={["yearsAndDateCovered", "from"]} noStyle>
                      <StyledDatePicker
                        placeholder="From (MM/DD/YYYY)"
                        format="MM/DD/YYYY"
                        onChange={(date) =>
                          handleServiceRecordDateChange(date, "from")
                        }
                        value={serviceRecordDates.from} // Ensure the value is controlled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name={["yearsAndDateCovered", "to"]} noStyle>
                      <StyledDatePicker
                        placeholder="To (MM/DD/YYYY)"
                        format="MM/DD/YYYY"
                        onChange={(date) =>
                          handleServiceRecordDateChange(date, "to")
                        }
                        value={serviceRecordDates.to} // Ensure the value is controlled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Performance Rating Date Range"
          visible={isPerformanceRatingModalVisible}
          onOk={handlePerformanceRatingOk}
          onCancel={() => setIsPerformanceRatingModalVisible(false)}
          centered
          bodyStyle={{ padding: "20px" }}
        >
          <Form layout="vertical">
            <Form.Item label="Performance Rating Date Range">
              <Input.Group compact>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Form.Item name={["yearsAndDateCovered", "from"]} noStyle>
                      <StyledDatePicker
                        placeholder="From (MM/DD/YYYY)"
                        format="MM/DD/YYYY"
                        onChange={(date) =>
                          handlePerformanceRatingDateChange(date, "from")
                        }
                        value={performanceRatingDates.from} // Ensure the value is controlled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item name={["yearsAndDateCovered", "to"]} noStyle>
                      <StyledDatePicker
                        placeholder="To (MM/DD/YYYY)"
                        format="MM/DD/YYYY"
                        onChange={(date) =>
                          handlePerformanceRatingDateChange(date, "to")
                        }
                        value={performanceRatingDates.to} // Ensure the value is controlled
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Other Types of Certification"
          visible={isCustomCertificationModalVisible}
          onOk={() => {
            setIsCustomCertificationModalVisible(false);
          }}
          onCancel={() => {
            setIsCustomCertificationModalVisible(false);
            setCustomCertification("");
          }}
          okText="Confirm"
        >
          <Form layout="vertical">
            <Form.Item label="Certification Name">
              <Input
                placeholder="Enter the certification you want to request"
                value={customCertification}
                onChange={(e) => setCustomCertification(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </StyledCard>
      <Footer />
    </Wrapper>
  );
};

export default EmployeeDashboard;
