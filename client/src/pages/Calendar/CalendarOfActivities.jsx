import { Card, Typography, Spin, Col, Row } from "antd";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import styled from "styled-components";
import Footer from "../global/Footer";
import useFetchCalendar from "../../hooks/CalendarHook/useFetchCalendar";
import { format } from "date-fns"; // To format dates

const StyledCard = styled(Card)`
  margin: 0 100px;
  background: none;
  border: none;

  @media (max-width: 780px) {
    margin: 2px;
  }
`;

const Wrapper = styled.div`
  font-family: "Montserrat", sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding-bottom: 20px; 
`;

const ResponsiveTypography = styled(Typography)`
  font-family: "Montserrat", sans-serif;
  font-weight: bold;
  font-size: clamp(14px, 2.5vw, 18px); /* Responsive font size */
`;

const CalendarOfActivities = () => {
  // Fetching calendar data
  const {
    calendar,
    loading: calendarLoading,
    error: calendarError,
  } = useFetchCalendar();

  return (
    <Wrapper>
      <Content>
        <StyledCard>
          <Header
            title="CALENDAR OF ACTIVITIES"
            subtitle="Calendar of Activities of Local Government Unit (LGU)"
          />

          {/* Display Loading Spinner */}
          {calendarLoading ? (
            <Spin />
          ) : calendarError ? (
            <Typography type="danger">
              Error: {calendarError.message}
            </Typography>
          ) : (
            <Box>
              {calendar && calendar.length > 0 ? (
                <Row gutter={[16, 16]} /* Add responsive gutter */>
                  {calendar.map((activity) => (
                    <Col
                      key={activity._id}
                      xs={24}
                      sm={12}
                      md={8}
                      lg={8}
                      xl={6}
                    >
                      <Card
                        title={activity.title}
                        bordered={true}
                        hoverable
                        style={{
                          marginBottom: "16px",
                          background: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <ResponsiveTypography>
                          {`From: ${format(
                            new Date(activity.start),
                            "MMMM d, yyyy"
                          )}`}
                        </ResponsiveTypography>
                        <ResponsiveTypography>
                          {`To: ${format(
                            new Date(activity.end),
                            "MMMM d, yyyy"
                          )}`}
                        </ResponsiveTypography>

                        {/* Conditionally display time if allDay is "No" */}
                        {!activity.allDay && (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "10px",
                              alignItems: "center",
                              fontFamily: "Montserrat",
                              fontWeight: "bold",
                            }}
                          >
                            Time: 
                            <ResponsiveTypography>
                              {`${format(new Date(activity.start), "h:mm a")}`}
                            </ResponsiveTypography>
                            -
                            <ResponsiveTypography>
                              {`${format(new Date(activity.end), "h:mm a")}`}
                            </ResponsiveTypography>
                          </Box>
                        )}

                        <ResponsiveTypography>
                          All Day:{" "}
                          <span
                            style={{ color: activity.allDay ? "green" : "red" }}
                          >
                            {activity.allDay ? "Yes" : "No"}
                          </span>
                        </ResponsiveTypography>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Typography>No activities found.</Typography>
              )}
            </Box>
          )}
        </StyledCard>
      </Content>
      <Footer />
    </Wrapper>
  );
};

export default CalendarOfActivities;
