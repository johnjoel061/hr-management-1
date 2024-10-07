import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import PeopleIcon from "@mui/icons-material/People";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import Header from "../../../components/Header";

//FETCH DATA
import useFetchUsers from "../../../hooks/UserHook/useFetchUsers";
import useFetchEligibilities from "../../../hooks/EligibilityHook/useFetchEligibilities";
import useFetchDepartment from "../../../hooks/DepartmentHook/useFetchDepartment";
//FETCH FORMS
import useFetchAppointment from "../../../hooks/FormsHook/AppointmentHook/useFetchAppointment";
import useFetchAssumptionOfDuty from "../../../hooks/FormsHook/AssumptionOfDutyHook/useFetchAssumptionOfDuty";
import useFetchOathOfOffice from "../../../hooks/FormsHook/OathOfOfficeHook/useFetchOathOfOffice";
import useFetchPersonalDataSheet from "../../../hooks/FormsHook/PersonalDataSheetHook/useFetchPersonalDataSheet";
import useFetchPositionDescriptionForm from "../../../hooks/FormsHook/PositionDescriptionFormHook/useFetchPositionDescriptionForm";

import useFetchCertificateOfEligibility from "../../../hooks/FormsHook/CertificateOfEligibilityHook/useFetchCertificateOfEligibility";
import useFetchDesignation from "../../../hooks/FormsHook/DesignationHook/useFetchDesignation";
import useFetchSaln from "../../../hooks/FormsHook/SalnHook/useFetchSaln";
import useFetchNosi from "../../../hooks/FormsHook/NosiHook/useFetchNosi";
import useFetchMedicalCertificate from "../../../hooks/FormsHook/medicalCertificateHook/useFetchMedicalCertificate";

import useFetchNbiClearance from "../../../hooks/FormsHook/NbiClearanceHook/useFetchNbiClearance";
import useFetchTor from "../../../hooks/FormsHook/TorHook/useFetchTor";
import useFetchMarriageContract from "../../../hooks/FormsHook/MarriageContractHook/useFetchMarriageContract";
import useFetchBirthCertificate from "../../../hooks/FormsHook/BirthCertificateHook/useFetchBirthCertificate";
import useFetchCertOfLeaveBalance from "../../../hooks/FormsHook/CertOfLeaveBalanceHook/useFetchCertOfLeaveBalance";
import useFetchClearanceMoneyPropertyAcct from "../../../hooks/FormsHook/ClearanceMoneyPropertyAcctHook/useFetchClearanceMoneyPropertyAcct";
import useFetchCommendationAndAward from "../../../hooks/FormsHook/CommendationAndAwardHook/useFetchCommendationAndAward";
import useFetchCopiesOfDiscipAction from "../../../hooks/FormsHook/CopiesOfDiscipActionHook/useFetchCopiesOfDiscipAction";
import useFetchCos from "../../../hooks/FormsHook/CosHook/useFetchCos";
import useFetchAllLeaveRequest from "../../../hooks/LeaveRequestHook/useFetchAllLeaveRequest";

const DashboardAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { users } = useFetchUsers();
  const { eligibilities } = useFetchEligibilities();
  const { department } = useFetchDepartment();
  //FETCH
  const { appointment } = useFetchAppointment();
  const { assumptionOfDuty } = useFetchAssumptionOfDuty();
  const { oathOfOffice } = useFetchOathOfOffice();
  const { personalDataSheet } = useFetchPersonalDataSheet();
  const { positionDescriptionForm } = useFetchPositionDescriptionForm();

  const { certificateOfEligibility } = useFetchCertificateOfEligibility();
  const { designation } = useFetchDesignation();
  const { saln } = useFetchSaln();
  const { nosi } = useFetchNosi();
  const { medicalCertificate } = useFetchMedicalCertificate();

  const { nbiClearance } = useFetchNbiClearance();
  const { tor } = useFetchTor();
  const { marriageContract } = useFetchMarriageContract();
  const { birthCertificate } = useFetchBirthCertificate();
  const { certOfLeaveBalance } = useFetchCertOfLeaveBalance();

  const { clearanceMoneyPropertyAcct } = useFetchClearanceMoneyPropertyAcct();
  const { commendationAndAward } = useFetchCommendationAndAward();
  const { copiesOfDiscipAction } = useFetchCopiesOfDiscipAction();
  const { cos } = useFetchCos();
  const { leaveRequests } = useFetchAllLeaveRequest();

  const pendingLeaveRequests = leaveRequests.filter(
    (request) => request.status === "pending"
  );
  const approvedLeaveRequests = leaveRequests.filter(
    (request) => request.status === "approved"
  );
  const rejectedLeaveRequests = leaveRequests.filter(
    (request) => request.status === "disapproved"
  );

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        width="79vw"
        gridTemplateColumns="repeat(10, 1fr)"
        gridAutoRows="100px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <PeopleIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {users.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            EMPLOYEES
          </Typography>
        </Box>

        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <ViewListOutlinedIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {eligibilities.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            ELIGIBILITIES
          </Typography>
        </Box>

        <Box
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <BusinessOutlinedIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {department.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            DEPARTMENT
          </Typography>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <ListAltOutlinedIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {leaveRequests.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            TOTAL LEAVE REQUESTS
          </Typography>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <PendingActionsOutlinedIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {pendingLeaveRequests.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            LEAVES PENDING
          </Typography>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <AssignmentTurnedInOutlinedIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {approvedLeaveRequests.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            LEAVES APPROVED
          </Typography>
        </Box>

        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{ padding: 2, fontFamily: "Montserrat" }}
        >
          <DangerousOutlinedIcon fontSize="large" />
          <Typography
            color={colors.greenAccent[400]}
            variant="h5"
            sx={{
              fontFamily: "Montserrat",
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {rejectedLeaveRequests.length}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Montserrat", letterSpacing: 1 }}
          >
            LEAVES DISAPPROVED
          </Typography>
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 8" gridRow="span 2">
          <Box m="5px">
            <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
              FORMS (201 Files)
            </Typography>
          </Box>
          <Box
            p="10px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
          >
            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {appointment.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Appointment
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {assumptionOfDuty.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Assumption of Duty
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {oathOfOffice.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Oath of Office
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {positionDescriptionForm.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                PDF
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {personalDataSheet.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                PDS
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {certificateOfEligibility.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Cert of Eligibility
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {designation.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Designation
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {saln.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                SALN
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {nosi.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                NOSI/NOSA
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {medicalCertificate.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Medical Certificate
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {nbiClearance.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                NBI Clearance
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {tor.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                TOR
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {cos.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Contract of Service
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {marriageContract.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Marriage Contract
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {birthCertificate.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Birth Certificate
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {certOfLeaveBalance.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Cert of Leave Balances
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {commendationAndAward.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Commendations & Awards
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {copiesOfDiscipAction.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Copies of Disciplinary Actions
              </Typography>
            </Box>

            <Box
              flex="1 1 calc(25% - 10px)"
              margin="5px"
              backgroundColor={colors.primary[400]}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ padding: 16, fontFamily: "Montserrat" }}
            >
              <Typography
                color="#f44336"
                style={{
                  fontFamily: "Montserrat",
                  fontWeight: "bold",
                  letterSpacing: 2,
                }}
              >
                {clearanceMoneyPropertyAcct.length}
              </Typography>
              <Typography
                variant="h6"
                style={{ fontFamily: "Montserrat", letterSpacing: 1 }}
              >
                Clr from Money & Property Acct
              </Typography>
            </Box>

          </Box>
        </Box>
       
      </Box>

      
    </Box>
  );
};

export default DashboardAdmin;
