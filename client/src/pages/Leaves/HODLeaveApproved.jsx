import {
  Box,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import useFetchAllLeaveRequest from "../../hooks/LeaveRequestHook/useFetchAllLeaveRequest";

import { tokens } from "../../theme";
import Header from "../../components/Header";

const HODLeaveApproved = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { leaveRequests } =
  useFetchAllLeaveRequest();

   // Filter the leave requests to show only rejected ones
   const approvedLeaveRequests = leaveRequests.filter(
    (request) => request.status === "approved"
  );

  const downloadLeaveRequestPDF = (id) => {
    window.open(`https://hr-management-1-baxp.onrender.com/api/employee/leave-requests/${id}/pdf`, '_blank');
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "lastName", headerName: "Last Name", width: 200 },
    { field: "firstName", headerName: "First Name", width: 200 },
    { field: "middleName", headerName: "Middle Name", width: 200 },
    { field: "suffix", headerName: "Suffix", width: 120 },
    {
      field: "dateOfFiling",
      headerName: "Date of Filing",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    { field: "position", headerName: "Position", width: 200 },
    { field: "gmail", headerName: "Gmail", width: 200 },

    { field: "leaveType", headerName: "Leave Type", width: 500 },

    {
      field: "startDate",
      headerName: "Start Date",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 200,
      renderCell: (params) => (
        <span>{format(new Date(params.value), "MMMM d, yyyy")}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <span style={{ fontWeight: "bold", color: "#388e3c" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 8, backgroundColor: '#4d55b3' }}
            onClick={() => downloadLeaveRequestPDF(params.row._id)}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  //EXPORT DATA EXCEL
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(approvedLeaveRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "approved leave Data Sheets"
    );
    XLSX.writeFile(workbook, "approvedLeaveRequests_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="LEAVE REQUESTS APPROVED"
        subtitle="List of Leave requests approved of the Local Government Unit (LGU)"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#388E3C",
            color: "#e0e0e0",
            margin: "0 20px",
            "&:hover": {
              backgroundColor: "#45A049",
            },
          }}
          onClick={handleExportToExcel}
        >
          <Box display="flex" alignItems="center">
            <Box mr={1}>Export to Excel</Box>
            <FeedOutlinedIcon />
          </Box>
        </Button>
      </Box>

      <Box
        m="20px 0 0 0"
        height="62vh"
        width="80vw"
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
          rows={approvedLeaveRequests || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default HODLeaveApproved;
