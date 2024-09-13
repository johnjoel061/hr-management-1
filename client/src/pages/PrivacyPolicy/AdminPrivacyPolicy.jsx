import { useState } from "react";
import Header from "../../components/Header";
import {
  useTheme,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useFetchPrivacyPolicy from "../../hooks/PrivacyPolicyHook/useFetchPrivacyPolicy";
import useAddPrivacyPolicy from "../../hooks/PrivacyPolicyHook/useAddPrivacyPolicy";
import useDeletePrivacyPolicy from "../../hooks/PrivacyPolicyHook/useDeletePrivacyPolicy";
import useUpdatePrivacyPolicy from "../../hooks/PrivacyPolicyHook/useUpdatePrivacyPolicy";

// Custom styles for the accordion
const CustomAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const CustomAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CustomAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const AdminPrivacyPolicy = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { privacyPolicy, loading: fetchLoading, error: fetchError, refetchPrivacyPolicy } = useFetchPrivacyPolicy();
  const { addPrivacyPolicy, loading: addLoading, error: addError } = useAddPrivacyPolicy();
  const { deletePrivacyPolicyById, loading: deleteLoading, error: deleteError } = useDeletePrivacyPolicy();
  const { updatePrivacyPolicyById, loading: updateLoading } = useUpdatePrivacyPolicy();

  const [privacyPolicyData, setPrivacyPolicyData] = useState({ privacyTitle: "", privacyDescription: "" });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrivacyPolicyData({ ...privacyPolicyData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update 
      await updatePrivacyPolicyById(editingId, privacyPolicyData);
    } else {
      // Add 
      await addPrivacyPolicy(privacyPolicyData);
    }
    refetchPrivacyPolicy();
    setPrivacyPolicyData({ privacyTitle: "", privacyDescription: "" }); // Clear form fields
    setEditingId(null); // Reset editing state
  };

  const handleEdit = (privacy) => {
    setPrivacyPolicyData({ privacyTitle: privacy.privacyTitle, privacyDescription: privacy.privacyDescription });
    setEditingId(privacy._id);
  };

  const handleDelete = async (id) => {
    await deletePrivacyPolicyById(id);
    refetchPrivacyPolicy(); // Refresh list after deletion
  };

  const renderFaqs = () => {
    if (fetchLoading) {
      return <CircularProgress />;
    }

    if (fetchError) {
      return <Typography color="error">Error fetching Privacy Policy: {fetchError.message}</Typography>;
    }

    return privacyPolicy.map((item) => (
      <CustomAccordion key={item._id}>
        <CustomAccordionSummary expandIcon={<ExpandMoreIcon />} style={{ background: colors.primary[400] }}>
          <Typography variant="h6" color={colors.greenAccent[500]} sx={{ fontFamily: "Montserrat, sans-serif" }}>
            {item.privacyTitle}
          </Typography>
        </CustomAccordionSummary>
        <CustomAccordionDetails>
          <Typography variant="body1" sx={{ fontFamily: "Montserrat, sans-serif" }}>
            {item.privacyDescription}
          </Typography>
        </CustomAccordionDetails>
        <Box m={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginRight: 8, backgroundColor: "#364bd1" }}
            onClick={() => handleEdit(item)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(item._id)}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
          {deleteError && <FormHelperText error>{deleteError}</FormHelperText>}
        </Box>
      </CustomAccordion>
    ));
  };

  return (
    <Box m="20px">
      <Header
        title="PRIVACY POLICIES"
        subtitle="Privacy Policies of the Local Government Unit (LGU)"
      />

      <Box m="40px 0" display="flex" justifyContent="left" alignItems="center">
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth style={{ marginBottom: "15px" }}>
                <InputLabel htmlFor="privacyTitle" sx={{ "&.Mui-focused": { color: "#f44336" } }}>
                  Privacy Policy Title
                </InputLabel>
                <OutlinedInput
                  id="privacyTitle"
                  name="privacyTitle"
                  type="text"
                  value={privacyPolicyData.privacyTitle}
                  onChange={handleInputChange}
                  label="Privacy Policy Title"
                  required
                  multiline
                  minRows={1} // Set the minimum number of rows
                  maxRows={10} // Set the maximum number of rows
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="privacyDescription" sx={{ "&.Mui-focused": { color: "#f44336" } }}>
                  Description
                </InputLabel>
                <OutlinedInput
                  id="privacyDescription"
                  name="privacyDescription"
                  type="text"
                  value={privacyPolicyData.privacyDescription}
                  onChange={handleInputChange}
                  label="Description"
                  required
                  multiline
                  minRows={4} // Set the minimum number of rows
                  maxRows={10} // Set the maximum number of rows
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <Button type="submit" variant="contained" color="error" disabled={addLoading || updateLoading}>
                <Box>
                  {addLoading || updateLoading ? <CircularProgress size={20} /> : (editingId ? "UPDATE PRIVACY POLICY" : "ADD PRIVACY POLICY")}
                </Box>
              </Button>
              {addError && <FormHelperText error>{addError}</FormHelperText>}
            </Grid>
          </Grid>
        </form>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 800 }}>{renderFaqs()}</Box>
    </Box>
  );
};

export default AdminPrivacyPolicy;
