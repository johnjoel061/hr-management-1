import { useState } from "react";
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from "@mui/material";
import Header from "../../components/Header";
import useAddLeaveType from '../../hooks/LeaveTypeHook/useAddLeaveType';

const AddLeaveType = () => {
  const { addLeaveType, loading, error } = useAddLeaveType();
  const [leaveType, setLeaveType] = useState('');

  const handleInputChange = (event) => {
    setLeaveType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addLeaveType({ leaveType });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="NEW LEAVE TYPE" subtitle="Add Leave Type" />
      </Box>

      <Box m="40px 0" display="flex" justifyContent="left" alignItems="center">
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", width: "50%"}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="leaveType"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Leave Type Title
                </InputLabel>
                <OutlinedInput
                  id="leaveType"
                  name="leaveType"
                  type="text"
                  value={leaveType}
                  onChange={handleInputChange}
                  label="Leave Type Title"
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
                <Box>{loading ? <CircularProgress size={20} /> : "ADD LEAVE TYPE"}</Box>
              </Button>
              {error && <FormHelperText error>{error}</FormHelperText>}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddLeaveType;
