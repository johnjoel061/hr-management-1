import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Form, Input, Spin, Typography } from "antd";
import useLogin from "../../hooks/AuthHook/useLogin";
import useFetchAllSettings from "../../hooks/SettingsHook/useFetchAllSettings";
// images
import Logo from "../../assets/images/LGU-LOGO.jpg";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  // Data Fetching
  const { loading, error, loginUser } = useLogin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    settings,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchAllSettings();
  const [linkLoading, setLinkLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin-dashboard");
      } 
      else if (user.role === "HOD") {
        navigate("/hod-dashboard");
      }
      else if (user.role === "M-ADMIN") {
        navigate("/m-admin-dashboard");
      }
      else if (user.role === "EMPLOYEE") {
        navigate("/employee-dashboard");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (values) => {
    await loginUser(values);
  };

  const handleForgotPasswordClick = () => {
    setLinkLoading(true);
    setTimeout(() => {
      setLinkLoading(false);
      navigate("/forgot-password");
    }, 1000); // Simulate a loading delay of 1 second
  };

  // Function to get responsive height
  const getResponsiveHeight = () => {
    const width = window.innerWidth;
    if (width <= 320) return "40px";
    if (width <= 480) return "50px";
    if (width <= 768) return "70px";
    return "90px";
  };

  const [logoHeight, setLogoHeight] = useState(getResponsiveHeight());

  useEffect(() => {
    const handleResize = () => {
      setLogoHeight(getResponsiveHeight());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //===========STYLING===========
  const wrapperStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px", // Optional: To add some padding around the card
  };

  const cardStyles = {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
  };

  const logoContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderBottom: "solid 1px rgba(0, 0, 0, 0.16)",
    padding: "10px",
    marginBottom: "1rem",
  };

  const formContainerStyles = {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  };

  const titleStyles = {
    textAlign: "center",
  };

  const sloganStyles = {
    textAlign: "center",
    paddingBottom: "1.5rem",
  };

  const buttonStyles = {
    width: "100%",
    marginTop: "1rem",
  };

  const alertStyles = {
    marginBottom: "1.5rem",
  };

  const forgotPasswordLinkStyles = {
    float: "right",
    cursor: "pointer",
    color: "#1677ff",
  };

  return (
    <>
      <div style={wrapperStyles}>
        <Card style={cardStyles}>
          {/* LOGO HERE */}
          {fetchLoading ? (
            <Spin />
          ) : fetchError ? (
            <Alert
              message="Error"
              description={fetchError.message}
              type="error"
              showIcon
            />
          ) : (
            settings &&
            settings.length > 0 && (
              <Link to="/login" style={logoContainerStyles}>
                <span className="logo">
                  <img
                    src={settings[0].lguAuthLogo || Logo}
                    alt="LGU Logo"
                    style={{ height: logoHeight, maxWidth: "100%" }}
                  />
                </span>
              </Link>
            )
          )}

          <div style={formContainerStyles}>
            <Typography.Title level={3} strong style={titleStyles}>
              Sign In
            </Typography.Title>
            <Typography.Text type="secondary" strong style={sloganStyles}>
              Enter your email address and password to access the dashboard
              panel.
            </Typography.Text>
            <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email",
                  },
                  {
                    type: "email",
                    message: "The input is not valid Email!",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                />
              </Form.Item>

              {error && (
                <Alert
                  description={error}
                  type="error"
                  showIcon
                  closable
                  style={alertStyles}
                />
              )}

              <Form.Item>
                <Button
                  type={`${loading ? "" : "primary"}`}
                  htmlType="submit"
                  size="large"
                  style={buttonStyles}
                >
                  {loading ? <Spin /> : "Sign In"}
                </Button>
              </Form.Item>

              <div
                style={forgotPasswordLinkStyles}
                onClick={handleForgotPasswordClick}
              >
                <small>
                  {linkLoading ? <Spin /> : "Forgot your password?"}
                </small>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Login;
