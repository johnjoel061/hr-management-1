import { Box, Button } from "@mui/material";
import { format } from "date-fns";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import * as XLSX from "xlsx";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import useFetchLeaveRequest from "../../hooks/LeaveRequestHook/useFetchAllLeaveRequest";

import { tokens } from "../../theme";
import Header from "../../components/Header";

const LeaveList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { leaveRequests } = useFetchLeaveRequest();

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
      field: "hodApproval",
      headerName: "Department Head",
      width: 200,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "pending":
            color = "#CDB008"; // Yellow for pending
            break;
          case "approved":
            color = "#388e3c"; // Green for approved
            break;
          case "disapproved":
            color = "#f44235"; // Red for rejected
            break;
          default:
            color = "#000000"; // Default color (black)
        }

        return (
          <span style={{ fontWeight: "bold", color }}>{params.value}</span>
        );
      },
    },
    {
      field: "adminApproval",
      headerName: "Authorized Officer",
      width: 200,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "pending":
            color = "#CDB008"; // Yellow for pending
            break;
          case "approved":
            color = "#388E3C"; // Green for approved
            break;
          case "disapproved":
            color = "#f44235"; // Red for rejected
            break;
          default:
            color = "#000000"; // Default color (black)
        }

        return (
          <span style={{ fontWeight: "bold", color }}>{params.value}</span>
        );
      },
    },
    {
      field: "mAdminApproval",
      headerName: "Municipal Administrator",
      width: 200,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "pending":
            color = "#CDB008"; // Yellow for pending
            break;
          case "approved":
            color = "#388e3c"; // Green for approved
            break;
          case "disapproved":
            color = "#f44235"; // Red for rejected
            break;
          default:
            color = "#000000"; // Default color (black)
        }

        return (
          <span style={{ fontWeight: "bold", color }}>{params.value}</span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        let color;
        switch (params.value) {
          case "pending":
            color = "#CDB008"; // Yellow for pending
            break;
          case "approved":
            color = "#388E3C"; // Green for approved
            break;
          case "disapproved":
            color = "#f44235"; // Red for rejected
            break;
          default:
            color = "#000000"; // Default color (black)
        }

        return (
          <span style={{ fontWeight: "bold", color }}>{params.value}</span>
        );
      },
    },
  ];

  //EXPORT DATA EXCEL
  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leaveRequests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "requests leave Data Sheets"
    );
    XLSX.writeFile(workbook, "leaveRequests_data_sheets.xlsx");
  };

  return (
    <Box m="20px">
      <Header
        title="LEAVE REQUESTS LIST"
        subtitle="List of Leave requests of the Local Government Unit (LGU)"
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
          rows={leaveRequests || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default LeaveList;
