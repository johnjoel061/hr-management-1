import { useState } from "react";
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, InputLabel, OutlinedInput } from "@mui/material";
import Header from "../../components/Header";
import useAddDepartment from '../../hooks/DepartmentHook/useAddDepartment';

const AddDepartment = () => {
  const { addDepartment, loading, error } = useAddDepartment();
  const [department, setDepartment] = useState('');

  const handleInputChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addDepartment({ department });
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="NEW DEPARTMENT" subtitle="Add Department" />
      </Box>

      <Box m="40px 0" display="flex" justifyContent="left" alignItems="center">
        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", width: "50%"}}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel
                  htmlFor="department"
                  sx={{ "&.Mui-focused": { color: "#f44336" } }}
                >
                  Department Name
                </InputLabel>
                <OutlinedInput
                  id="department"
                  name="department"
                  type="text"
                  value={department}
                  onChange={handleInputChange}
                  label="Department Name"
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
                <Box>{loading ? <CircularProgress size={20} /> : "ADD DEPARTMENT"}</Box>
              </Button>
              {error && <FormHelperText error>{error}</FormHelperText>}
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddDepartment;
