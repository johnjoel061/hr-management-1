import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';

import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard/EmployeeDashboard';
import Login from './pages/Account/Login';
import ForgotPassword from './pages/Account/ForgotPassword';
import Topbar from './pages/global/Topbar';
import AdminSidebar from './pages/Dashboard/AdminDashboard/AdminSidebar'; 
import AdminFaq from './pages/Faqs/AdminFaq'; 
import AdminCalendar from './pages/Calendar/AdminCalendar';
import AdminOrgStructure from './pages/OrgStructure/AdminOrgStructure';

import DashboardAdmin from './pages/Dashboard/AdminDashboard/DashboardAdmin';
import EmployeeList from './pages/Employee/EmployeeList';
import AddEmployee from './pages/Employee/AddEmployee';
import EmployeeDetails from './pages/Employee/EmployeeDetails';
import AddDepartment from './pages/Department/AddDepartment';
import DepartmentList from './pages/Department/DepartmentList';
import AddEligibility from './pages/Eligibilities/AddEligibility';
import EligibilityList from './pages/Eligibilities/EligibilityList';

import AddLeaveType from './pages/Leaves/AddLeaveType';
import LeaveTypeList from './pages/Leaves/LeaveTypeList';
import LeaveList from './pages/Leaves/LeaveList';
import LeaveDisapproved from './pages/Leaves/LeaveDisapproved';
import AdminLeavePending from './pages/Leaves/AdminLeavePending';
import LeaveApproved from './pages/Leaves/LeaveApproved';

import Appointment from './pages/Forms/Appointment';
import AssumptionOfDuty from './pages/Forms/AssumptionOfDuty';
import OathOfOffice from './pages/Forms/OathOfOffice';
import PersonalDataSheet from './pages/Forms/PersonalDataSheet';
import PositionDescriptionForm from './pages/Forms/PositionDescriptionForm';
import CertificateOfEligibility from './pages/Forms/CertificateOfEligibility';
import Designation from './pages/Forms/Designation';
import Saln from './pages/Forms/Saln';
import NosiNosa from './pages/Forms/NosiNosa';
import MedicalCertificate from './pages/Forms/MedicalCertificate';
import NbiClearance from './pages/Forms/NbiClearance';
import TranscriptOfRecords from './pages/Forms/TranscriptOfRecords';
import MarriageContract from './pages/Forms/MarriageContract';
import BirthCertificate from './pages/Forms/BirthCertificate';
import CertificationOfLeaveBalances from './pages/Forms/CertificationOfLeaveBalances';
import ClrMoneyPropertyAccountabilities from './pages/Forms/ClrMoneyPropertyAccountabilities';
import CommendationsAndAwards from './pages/Forms/CommendationsAndAwards';
import CopiesOfDisciplinaryActions from './pages/Forms/CopiesOfDisciplinaryActions';
import ContractOfService from './pages/Forms/ContractOfService';
import AdminPrivacyPolicy from './pages/PrivacyPolicy/AdminPrivacyPolicy';
import AdminSettings from './pages/Settings/AdminSettings';
import EditSettings from './pages/Settings/EditSettings';
import EmployeePrivacyPolicy from './pages/PrivacyPolicy/EmployeePrivacyPolicy';
import EmployeeFaq from './pages/Faqs/EmployeeFaq';
import OrganizationalStructure from './pages/OrgStructure/OrganizationalStructure';
import CalendarOfActivities from './pages/Calendar/CalendarOfActivities';

import RequestFormPending from './pages/RequestForm/RequestFormPending';
import RequestFormApproved from './pages/RequestForm/RequestFormApproved';
import RequestFormRejected from './pages/RequestForm/RequestFormRejected';

import DashboardHOD from './pages/Dashboard/HODDashboard/DashboardHOD';
import HODSidebar from './pages/Dashboard/HODDashboard/HODSidebar';
import HODLeavePending from './pages/Leaves/HODLeavePending';
import HODLeaveDisapproved from './pages/Leaves/HODLeaveDisapproved';
import HODLeaveApproved from './pages/Leaves/HODLeaveApproved';

import DashboardMAdmin from './pages/Dashboard/MAdminDashboard/DashboardMAdmin';
import MAdminSidebar from './pages/Dashboard/MAdminDashboard/MAdminSidebar';
import MAdLeavePending from './pages/Leaves/MAdminLeavePending';
import MAdminLeaveApproved from './pages/Leaves/MAdminLeaveApproved';
import MAdminLeaveDisapproved from './pages/Leaves/MAdminLeaveDisapproved';


const App = () => {
  const { isAuthenticated, userData } = useAuth();
  const [theme, colorMode] = useMode();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Function to determine where to redirect based on user role
  const getRedirectPath = () => {
    if (userData.role === 'ADMIN') return '/admin-dashboard';
    if (userData.role === 'EMPLOYEE') return '/employee-dashboard';
    if (userData.role === 'HOD') return '/hod-dashboard';
    if (userData.role === 'M-ADMIN') return '/m-admin-dashboard';
    return '/';
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ColorModeContext.Provider value={colorMode}>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            {isAuthenticated && userData.role === 'ADMIN' && (
              <AdminSidebar className="sidebar" isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed}  />
            )}

            {isAuthenticated && userData.role === 'HOD' && (
              <HODSidebar className="sidebar" isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed}  />
            )} 

            {isAuthenticated && userData.role === 'M-ADMIN' && (
              <MAdminSidebar className="sidebar" isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed}  />
            )}    

            <main style={{ flexGrow: 1, overflowX: 'hidden' }}>
              {isAuthenticated && <Topbar setIsSidebar={setIsSidebarCollapsed} className="topbar"/>}
              <Routes>
                <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to={getRedirectPath()} />} />
                <Route path="/admin-dashboard" element={isAuthenticated && userData.role === 'ADMIN' ? <DashboardAdmin /> : <Navigate to={getRedirectPath()} />
                
                {/*EMPLOYEE*/}
                <Route path="/add-employee" element={isAuthenticated && userData.role === 'ADMIN' ? <AddEmployee /> : <Navigate to={getRedirectPath()} />
                <Route path="/employee-list" element={isAuthenticated && userData.role === 'ADMIN' ? <EmployeeList /> : <Navigate to="/" />} />
                <Route path="/employee-list/employee-details/:id" element={isAuthenticated && userData.role === 'ADMIN' ? <EmployeeDetails /> : <Navigate to="/" />} />

                {/*ELIGIBILITIES*/}
                <Route path="/add-eligibility" element={isAuthenticated && userData.role === 'ADMIN' ? <AddEligibility /> : <Navigate to="/" />} />
                <Route path="/eligibility-list" element={isAuthenticated && userData.role === 'ADMIN' ? <EligibilityList /> : <Navigate to="/" />} />

                {/*DEPARTMENT*/}
                <Route path="/new-department" element={isAuthenticated && userData.role === 'ADMIN' ? <AddDepartment /> : <Navigate to="/" />} />
                <Route path="/department-list" element={isAuthenticated && userData.role === 'ADMIN' ? <DepartmentList /> : <Navigate to="/" />} />

                {/*LEAVES*/}
                <Route path="/add-leave-type" element={isAuthenticated && userData.role === 'ADMIN' ? <AddLeaveType /> : <Navigate to="/" />} />
                <Route path="/leave-type-list" element={isAuthenticated && userData.role === 'ADMIN' ? <LeaveTypeList /> : <Navigate to="/" />} />
                <Route path="/leave-list" element={isAuthenticated && userData.role === 'ADMIN' ? <LeaveList /> : <Navigate to="/" />} />
                <Route path="/leave-pending" element={isAuthenticated && userData.role === 'ADMIN' ? <AdminLeavePending /> : <Navigate to="/" />} />
                <Route path="/leave-approved" element={isAuthenticated && userData.role === 'ADMIN' ? <LeaveApproved /> : <Navigate to="/" />} />
                <Route path="/leave-disapproved" element={isAuthenticated && userData.role === 'ADMIN' ? <LeaveDisapproved /> : <Navigate to="/" />} />

                {/*PAGES*/}
                <Route path="/calendar" element={isAuthenticated && userData.role === 'ADMIN' ? <AdminCalendar /> : <Navigate to="/" />} />
                <Route path="/faqs" element={isAuthenticated && userData.role === 'ADMIN' ? <AdminFaq /> : <Navigate to="/" />} />
                <Route path="/organizational-structure" element={isAuthenticated && userData.role === 'ADMIN' ? <AdminOrgStructure /> : <Navigate to="/" />} />
                <Route path="/privacy-policy" element={isAuthenticated && userData.role === 'ADMIN' ? <AdminPrivacyPolicy /> : <Navigate to="/" />} />
                <Route path="/settings" element={isAuthenticated && userData.role === 'ADMIN' ? <AdminSettings /> : <Navigate to="/" />} />
                <Route path="/settings/edit/:id" element={isAuthenticated && userData.role === 'ADMIN' ? <EditSettings /> : <Navigate to="/" />} />

                {/*FORMS*/}
                <Route path="/forms-appointment" element={isAuthenticated && userData.role === 'ADMIN' ? <Appointment /> : <Navigate to="/" />} />
                <Route path="/forms-assumption-of-duty" element={isAuthenticated && userData.role === 'ADMIN' ? <AssumptionOfDuty /> : <Navigate to="/" />} />
                <Route path="/forms-oath-of-office" element={isAuthenticated && userData.role === 'ADMIN' ? <OathOfOffice /> : <Navigate to="/" />} />
                <Route path="/forms-personal-data-sheet" element={isAuthenticated && userData.role === 'ADMIN' ? <PersonalDataSheet /> : <Navigate to="/" />} />
                <Route path="/forms-position-description" element={isAuthenticated && userData.role === 'ADMIN' ? <PositionDescriptionForm /> : <Navigate to="/" />} />
                <Route path="/forms-certificate-of-eligibility" element={isAuthenticated && userData.role === 'ADMIN' ? <CertificateOfEligibility /> : <Navigate to="/" />} />

                <Route path="/forms-designation" element={isAuthenticated && userData.role === 'ADMIN' ? <Designation /> : <Navigate to="/" />} />
                <Route path="/forms-saln" element={isAuthenticated && userData.role === 'ADMIN' ? <Saln /> : <Navigate to="/" />} />
                <Route path="/forms-nosi-nosa" element={isAuthenticated && userData.role === 'ADMIN' ? <NosiNosa /> : <Navigate to="/" />} />
                <Route path="/forms-medical-certificate" element={isAuthenticated && userData.role === 'ADMIN' ? <MedicalCertificate /> : <Navigate to="/" />} />
                <Route path="/forms-nbi-clearance" element={isAuthenticated && userData.role === 'ADMIN' ? <NbiClearance /> : <Navigate to="/" />} />
                <Route path="/forms-transcript-of-records" element={isAuthenticated && userData.role === 'ADMIN' ? <TranscriptOfRecords /> : <Navigate to="/" />} />

                <Route path="/forms-marriage-contract" element={isAuthenticated && userData.role === 'ADMIN' ? <MarriageContract /> : <Navigate to="/" />} />
                <Route path="/forms-birth-certificate" element={isAuthenticated && userData.role === 'ADMIN' ? <BirthCertificate /> : <Navigate to="/" />} />
                <Route path="/forms-certification-of-leave-balances" element={isAuthenticated && userData.role === 'ADMIN' ? <CertificationOfLeaveBalances /> : <Navigate to="/" />} />
                <Route path="/forms-clearance-from-money-and-property-accountabilities" element={isAuthenticated && userData.role === 'ADMIN' ? <ClrMoneyPropertyAccountabilities /> : <Navigate to="/" />} />
                <Route path="/forms-commendations-and-awards" element={isAuthenticated && userData.role === 'ADMIN' ? <CommendationsAndAwards /> : <Navigate to="/" />} />
                <Route path="/forms-copies-of-disciplinary-actions" element={isAuthenticated && userData.role === 'ADMIN' ? <CopiesOfDisciplinaryActions /> : <Navigate to="/" />} />
                <Route path="/forms-contract-of-service" element={isAuthenticated && userData.role === 'ADMIN' ? <ContractOfService /> : <Navigate to="/" />} />

                {/*REQUESTED FORM*/}
                <Route path="/requested-forms" element={isAuthenticated && userData.role === 'ADMIN' ? <RequestFormPending /> : <Navigate to="/" />} />
                <Route path="/request-approved" element={isAuthenticated && userData.role === 'ADMIN' ? <RequestFormApproved /> : <Navigate to="/" />} />
                <Route path="/request-rejected" element={isAuthenticated && userData.role === 'ADMIN' ? <RequestFormRejected /> : <Navigate to="/" />} />

                {/*EMPLOYEE SECTION*/}
                <Route path="/employee-dashboard" element={isAuthenticated && userData.role === 'EMPLOYEE' ? <EmployeeDashboard /> : <Navigate to="/" />} />
                <Route path="/employee-privacy-policy" element={isAuthenticated && userData.role === 'EMPLOYEE' ? <EmployeePrivacyPolicy /> : <Navigate to="/" />} />
                <Route path="/employee-faqs" element={isAuthenticated && userData.role === 'EMPLOYEE' ? <EmployeeFaq /> : <Navigate to="/" />} />
                <Route path="/employee-organizational-structure" element={isAuthenticated && userData.role === 'EMPLOYEE' ? <OrganizationalStructure /> : <Navigate to="/" />} />
                <Route path="/employee-calendar-of-activities" element={isAuthenticated && userData.role === 'EMPLOYEE' ? <CalendarOfActivities /> : <Navigate to="/" />} />

                {/*HOD SECTION*/}
                <Route path="/hod-dashboard" element={isAuthenticated && userData.role === 'HOD' ? <DashboardHOD /> : <Navigate to="/" />} />
                {/*LEAVES*/}
                <Route path="/hod-add-leave-type" element={isAuthenticated && userData.role === 'HOD' ? <AddLeaveType /> : <Navigate to="/" />} />
                <Route path="/hod-leave-type-list" element={isAuthenticated && userData.role === 'HOD' ? <LeaveTypeList /> : <Navigate to="/" />} />
                <Route path="/hod-leave-list" element={isAuthenticated && userData.role === 'HOD' ? <LeaveList /> : <Navigate to="/" />} />
                <Route path="/hod-leave-pending" element={isAuthenticated && userData.role === 'HOD' ? <HODLeavePending /> : <Navigate to="/" />} />
                <Route path="/hod-leave-approved" element={isAuthenticated && userData.role === 'HOD' ? <HODLeaveApproved /> : <Navigate to="/" />} />
                <Route path="/hod-leave-disapproved" element={isAuthenticated && userData.role === 'HOD' ? <HODLeaveDisapproved/> : <Navigate to="/" />} />

                {/*HOD SECTION*/}
                <Route path="/m-admin-dashboard" element={isAuthenticated && userData.role === 'M-ADMIN' ? <DashboardMAdmin /> : <Navigate to="/" />} />
                {/*LEAVES*/}
                <Route path="/m-admin-leave-list" element={isAuthenticated && userData.role === 'M-ADMIN' ? <LeaveList /> : <Navigate to="/" />} />
                <Route path="/m-admin-leave-pending" element={isAuthenticated && userData.role === 'M-ADMIN' ? <MAdLeavePending/> : <Navigate to="/" />} />
                <Route path="/m-admin-leave-approved" element={isAuthenticated && userData.role === 'M-ADMIN' ? <MAdminLeaveApproved /> : <Navigate to="/" />} />
                <Route path="/m-admin-leave-disapproved" element={isAuthenticated && userData.role === 'M-ADMIN' ? <MAdminLeaveDisapproved /> : <Navigate to="/" />} />
                
                {/*FORGOT PASSWORD SECTION*/}
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </ColorModeContext.Provider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
