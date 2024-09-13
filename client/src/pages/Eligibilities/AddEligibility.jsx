import { useState } from "react";
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from "@mui/material";
import Header from "../../components/Header";
import useAddEligibility from '../../hooks/EligibilityHook/useAddEligibility';

const AddEligibility = () => {
  const { addEligibility, loading, error } = useAddEligibility();
  const [eligibilityTitle, setEligibilityTitle] = useState('');

  const handleInputChange = (event) => {
    setEligibilityTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call addEligibility function from the hook
    await addEligibility({ eligibilityTitle });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="NEW ELIGIBILITY" subtitle="Add Eligibility" />
      </Box>

      <Box m="40px 0" display="flex" justifyContent="left" alignItems="center">
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", width: "50%"}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="eligibility-title"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Eligibility Title
                </InputLabel>
                <OutlinedInput
                  id="eligibility-title"
                  name="eligibilityTitle"
                  type="text"
                  value={eligibilityTitle}
                  onChange={handleInputChange}
                  label="Eligibility Title"
                  required
                  sx={{
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f44336",
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={loading}
              >
                <Box>{loading ? <CircularProgress size={20} /> : "ADD ELIGIBILITY"}</Box>
              </Button>
              {error && <FormHelperText error>{error}</FormHelperText>}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddEligibility;
