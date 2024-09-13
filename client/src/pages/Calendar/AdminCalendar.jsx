import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { formatDate } from "@fullcalendar/core";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import useFetchCalendar from "../../hooks/CalendarHook/useFetchCalendar"; // Adjust the path as needed
import useAddCalendar from "../../hooks/CalendarHook/useAddCalendar"; // Adjust the path as needed
import useDeleteCalendar from "../../hooks/CalendarHook/useDeleteCalendar"; // Adjust the path as needed

const AdminCalendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const {
    calendar,
    loading: fetchLoading,
    error: fetchError,
    refetchCalendar,
  } = useFetchCalendar();
  const {
    addCalendar,
    loading: addLoading,
    error: addError,
  } = useAddCalendar();
  const {
    deleteFaqById,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteCalendar();

  useEffect(() => {
    if (calendar.length > 0) {
      setCurrentEvents(calendar);
    }
  }, [calendar]);

  const handleDateClick = (selected) => {
    setSelectedDate(selected);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = async () => {
    if (newEventTitle && selectedDate) {
      const eventData = {
        title: newEventTitle,
        start: selectedDate.startStr,
        end: selectedDate.endStr,
        allDay: selectedDate.allDay,
      };

      try {
        await addCalendar(eventData);
        await refetchCalendar(); // Refetch the events to update the list
        handleDialogClose(); // Close the dialog
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteFaqById(id);
      await refetchCalendar(); // Refetch the events to update the list
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const formatEventDate = (event) => {
    if (event.allDay) {
      return `${formatDate(event.start, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })} - All-day`;
    }
    return `${formatDate(event.start, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })} - ${formatDate(event.end, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  return (
    <Box m="20px">
      <Header
        title="CALENDAR"
        subtitle="Full Calendar Page of Local Government Unit (LGU)"
      />

      <Box display="flex" justifyContent="space-between">
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Montserrat, Arial, sans-serif",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            Events
          </Typography>
          {fetchLoading ? (
            <Typography>Loading...</Typography>
          ) : fetchError ? (
            <Typography>Error fetching events</Typography>
          ) : (
            <List>
              {currentEvents.map((event) => (
                <ListItem
                key={event._id}
                sx={{
                  backgroundColor: "#f44336",
                  margin: "10px 0",
                  borderRadius: "2px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start", // Align items to the start of the container
                  width: "350px",
                }}
              >
                <IconButton
                  onClick={() => handleDeleteEvent(event._id)}
                  color="#d84646"
                  sx={{ position: "absolute", right: 10, top: 10 }}
                >
                  <DeleteIcon />
                </IconButton>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        overflow: "hidden",
                        marginBottom: "10px",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal", // Allow wrapping
                        wordBreak: "break-word", // Break long words
                        marginRight: "48px", // Space for the IconButton
                      }}
                    >
                      {event.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal", // Allow wrapping
                        wordBreak: "break-word", // Break long words
                      }}
                    >
                      {formatEventDate(event)}
                    </Typography>
                  }
                />
              </ListItem>
              
              ))}
            </List>
          )}
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            events={currentEvents}
          />
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            sx={{ width: "260px" }}
            multiline
            minRows={1}
            maxRows={10}
          />
          {addError && <Typography color="error">{addError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddEvent} color="error" disabled={addLoading}>
            {addLoading ? "Adding..." : "Add Event"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCalendar;
