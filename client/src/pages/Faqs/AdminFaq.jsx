import React, { useState } from "react";
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
import useFetchFaq from "../../hooks/FaqHook/useFetchFaq";
import useAddFaq from "../../hooks/FaqHook/useAddFaq";
import useDeleteFaq from "../../hooks/FaqHook/useDeleteFaq";
import useUpdateFaq from "../../hooks/FaqHook/useUpdateFaq";

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

const AdminFaq = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { faq, loading: fetchLoading, error: fetchError, refetchFaq } = useFetchFaq();
  const { addFaq, loading: addLoading, error: addError } = useAddFaq();
  const { deleteFaqById, loading: deleteLoading, error: deleteError } = useDeleteFaq();
  const { updateFaqById, loading: updateLoading } = useUpdateFaq();

  const [faqData, setFaqData] = useState({ faq: "", faqAnswer: "" });
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFaqData({ ...faqData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update FAQ
      await updateFaqById(editingId, faqData);
    } else {
      // Add FAQ
      await addFaq(faqData);
    }
    refetchFaq();
    setFaqData({ faq: "", faqAnswer: "" }); // Clear form fields
    setEditingId(null); // Reset editing state
  };

  const handleEdit = (faq) => {
    setFaqData({ faq: faq.faq, faqAnswer: faq.faqAnswer });
    setEditingId(faq._id);
  };

  const handleDelete = async (id) => {
    await deleteFaqById(id);
    refetchFaq(); // Refresh the FAQ list after deletion
  };

  const renderFaqs = () => {
    if (fetchLoading) {
      return <CircularProgress />;
    }

    if (fetchError) {
      return <Typography color="error">Error fetching FAQs: {fetchError.message}</Typography>;
    }

    return faq.map((item) => (
      <CustomAccordion key={item._id}>
        <CustomAccordionSummary expandIcon={<ExpandMoreIcon />} style={{ background: colors.primary[400] }}>
          <Typography variant="h6" color={colors.greenAccent[500]} sx={{ fontFamily: "Montserrat, sans-serif" }}>
            {item.faq}
          </Typography>
        </CustomAccordionSummary>
        <CustomAccordionDetails>
          <Typography variant="body1" sx={{ fontFamily: "Montserrat, sans-serif" }}>
            {item.faqAnswer}
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
        title="FREQUENTLY ASK QUESTIONS (FAQs)"
        subtitle="List of Frequently Ask Questions (FAQs) of the Local Government Unit (LGU)"
      />

      <Box m="40px 0" display="flex" justifyContent="left" alignItems="center">
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", width: "50%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth style={{ marginBottom: "15px" }}>
                <InputLabel htmlFor="faq" sx={{ "&.Mui-focused": { color: "#f44336" } }}>
                  Frequently Ask Question (Faq)
                </InputLabel>
                <OutlinedInput
                  id="faq"
                  name="faq"
                  type="text"
                  value={faqData.faq}
                  onChange={handleInputChange}
                  label="Frequently Ask Question"
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
                <InputLabel htmlFor="faqAnswer" sx={{ "&.Mui-focused": { color: "#f44336" } }}>
                  Answer
                </InputLabel>
                <OutlinedInput
                  id="faqAnswer"
                  name="faqAnswer"
                  type="text"
                  value={faqData.faqAnswer}
                  onChange={handleInputChange}
                  label="Answer"
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
                  {addLoading || updateLoading ? <CircularProgress size={20} /> : (editingId ? "UPDATE FAQ" : "ADD FAQ")}
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

export default AdminFaq;
