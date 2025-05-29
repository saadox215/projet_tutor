"use client";

import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Fade,
  Backdrop,
  Chip,
  ButtonBase,
  useScrollTrigger,
  Slide,
  Fab,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  QuestionAnswer as QuizIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout,
  Announcement as AnnouncementIcon,
  School,
  ArrowUpward,
  VideoCall,
  CalendarMonth,
  MenuOpen,
  Search as SearchIcon,
  Close as CloseIcon,
  Fingerprint as FingerprintIcon,
} from "@mui/icons-material";

import ProfessorHome from "./ProfessorHome";
import AnnouncementPage from "./AnnouncementPage";
import CreateMeeting from "./CreateMeeting";
import MeetingList from "./MeetingList";
import Fichier from "./Fichier";
import Quiz from "./Quiz";
import Profile from "./Profile";

const getToken = () => localStorage.getItem("token");

// Custom components for visual interest
const AvatarPulse = ({ src, status }) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Avatar
        src={src || "/placeholder.svg?height=40&width=40"}
        sx={{
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          border: "2px solid",
          borderColor: "background.paper",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      />
      {status && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: { xs: 10, sm: 12 },
            height: { xs: 10, sm: 12 },
            borderRadius: "50%",
            bgcolor: status === "online" ? "success.main" : "warning.main",
            border: "2px solid",
            borderColor: "background.paper",
          }}
        />
      )}
    </Box>
  );
};

// Animated quick action button
const QuickAction = ({ icon, label, color, onClick }) => (
  <ButtonBase
    component={motion.div}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: { xs: 70, sm: 90 },
      width: { xs: 70, sm: 90 },
      borderRadius: 2,
      bgcolor: color,
      color: "white",
      transition: "all 0.2s",
    }}
  >
    {icon}
    <Typography
      variant="caption"
      sx={{ mt: 1, fontWeight: "medium", fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
    >
      {label}
    </Typography>
  </ButtonBase>
);

// Hide app bar on scroll
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const drawerWidth = 240;

const ProfessorDashboard = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fabVisible, setFabVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const systemTheme = useTheme();
  const isMobile = useMediaQuery(systemTheme.breakpoints.down("sm"));

  // Token validation function
  const handleValidity = async () => {
    const token = getToken();
    if (!token) {
      setSnackbar({
        open: true,
        message: "No token found. Please log in again.",
        severity: "error",
      });
      handleLogout();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8081/api/auth/verifier_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        localStorage.removeItem("token");
        handleLogout();
      }
    } catch (error) {
      setError("Authentication failed. Please check your credentials.");
      setSnackbar({
        open: true,
        message: "Authentication failed. Please check your credentials.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate token on component mount
  useEffect(() => {
    handleValidity();
  }, []);

  // Debounced scroll handler for FAB
  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setFabVisible(true);
    } else {
      setFabVisible(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Custom theme with color modes
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#BB86FC" : "#6200EE",
      },
      secondary: {
        main: darkMode ? "#03DAC6" : "#03DAC6",
      },
      background: {
        default: darkMode ? "#121212" : "#f5f7fa",
        paper: darkMode ? "#1e1e1e" : "#ffffff",
      },
      gradient: {
        primary: "linear-gradient(45deg, #6200EE 30%, #BB86FC 90%)",
        secondary: "linear-gradient(45deg, #FF5722 30%, #FFC107 90%)",
        success: "linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)",
        info: "linear-gradient(45deg, #2196F3 30%, #03A9F4 90%)",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 600,
        fontSize: { xs: "1rem", sm: "1.25rem" },
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: { xs: "0.875rem", sm: "1rem" },
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: "none",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "4px 8px",
            "&.Mui-selected": {
              background: darkMode
                ? "rgba(187, 134, 252, 0.12)"
                : "rgba(98, 0, 238, 0.08)",
            },
          },
        },
      },
    },
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    setLoading(true);
    setTimeout(() => {
      onLogout();
      navigate("/login");
    }, 500); // Reduced timeout for faster logout
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    setSnackbar({
      open: true,
      message: `${darkMode ? "Light" : "Dark"} mode activated`,
      severity: "info",
    });
  };

  const handleQuickAction = (action) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (action === "meeting") {
        navigate("/professor/createMeetings");
      } else if (action === "quiz") {
        navigate("/professor/quizzes");
      } else if (action === "announcement") {
        navigate("/professor/announcements");
      }
      setSnackbar({
        open: true,
        message: `Quick ${action} action triggered`,
        severity: "success",
      });
    }, 400); // Reduced timeout for faster navigation
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon fontSize={isMobile ? "small" : "medium"} />,
      path: "/professor/home",
      color: theme.palette.primary.main,
    },
    {
      text: "Assignments",
      icon: <AssignmentIcon fontSize={isMobile ? "small" : "medium"} />,
      path: "/professor/assignments",
      color: "#FF5722",
    },
    {
      text: "Quizzes & Exams",
      icon: <QuizIcon fontSize={isMobile ? "small" : "medium"} />,
      path: "/professor/quizzes",
      color: "#4CAF50",
    },
    {
      text: "Meetings",
      icon: <CalendarMonth fontSize={isMobile ? "small" : "medium"} />,
      path: "/professor/ListMeetings",
      color: "#2196F3",
    },
    {
      text: "Schedule",
      icon: <VideoCall fontSize={isMobile ? "small" : "medium"} />,
      path: "/professor/createMeetings",
      color: "#9C27B0",
    },
    {
      text: "Announcements",
      icon: <AnnouncementIcon fontSize={isMobile ? "small" : "medium"} />,
      path: "/professor/announcements",
      color: "#FF9800",
    },
  ];

  const notifications = [
    {
      id: 1,
      text: "15 new assignment submissions to grade",
      time: "2 hours ago",
      type: "assignment",
      color: "#FF5722",
    },
    {
      id: 2,
      text: "Student Ahmed requested a meeting",
      time: "5 hours ago",
      type: "meeting",
      color: "#2196F3",
    },
    {
      id: 3,
      text: "Department meeting tomorrow at 10 AM",
      time: "1 day ago",
      type: "calendar",
      color: "#9C27B0",
    },
  ];

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("announcements")) return "Announcement Management";
    if (path.includes("ListMeetings")) return "Meeting Schedule";
    if (path.includes("createMeetings")) return "Create Meeting";
    if (path.includes("assignments")) return "Assignment Manager";
    if (path.includes("quizzes")) return "Quiz & Exam Center";
    if (path.includes("settings")) return "Profile Settings";
    return "Professor Dashboard";
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: darkMode
          ? "linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(20,20,20,1) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,248,255,1) 100%)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 1.5, sm: 2 },
          pb: 3,
          background: darkMode
            ? "linear-gradient(135deg, rgba(98,0,238,0.8) 0%, rgba(187,134,252,0.8) 100%)"
            : "linear-gradient(135deg, rgba(98,0,238,1) 0%, rgba(123,31,162,1) 100%)",
          color: "#fff",
          borderRadius: "0 0 16px 16px",
          mb: 1,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }} // Reduced duration for faster animation
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <School sx={{ fontSize: { xs: 24, sm: 30 }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              SmartClass
            </Typography>
          </Box>
        </motion.div>
      </Toolbar>

      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          display: "flex",
          alignItems: "center",
          background: darkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.02)",
          mx: { xs: 1, sm: 2 },
          borderRadius: 2,
          mb: 2,
        }}
      >
        <AvatarPulse
          src={user?.avatar || "/placeholder.svg?height=40&width=40"}
          status="online"
        />
        <Box sx={{ ml: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle1"
            fontWeight="medium"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            {user?.name || "Prof. Alexandra"}
          </Typography>
          <Chip
            label="Professor"
            size="small"
            sx={{
              height: 20,
              fontSize: "0.625rem",
              background: darkMode
                ? "rgba(187,134,252,0.2)"
                : "rgba(98,0,238,0.1)",
              color: darkMode ? "#BB86FC" : "#6200EE",
            }}
          />
        </Box>
      </Box>

      <List sx={{ px: 1, py: 0, flexGrow: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, staggerChildren: 0.05 }} // Reduced stagger for faster rendering
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    "&::before": location.pathname === item.path
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: "25%",
                          height: "50%",
                          width: 4,
                          borderRadius: "0 4px 4px 0",
                          backgroundColor: item.color,
                        }
                      : {},
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color:
                        location.pathname === item.path
                          ? item.color
                          : "inherit",
                      minWidth: { xs: 36, sm: 40 },
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
                  />
                  {location.pathname === item.path && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        ml: 1,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </motion.div>
      </List>

      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate("/professor/settings")}
            >
              <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: { xs: 36, sm: 40 } }}>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />

        {/* Loading overlay */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Notification snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* App Bar */}
        <HideOnScroll>
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              bgcolor: "background.paper",
              color: "text.primary",
              boxShadow: darkMode
                ? "0 4px 20px rgba(0,0,0,0.15)"
                : "0 4px 20px rgba(0,0,0,0.05)",
              borderBottom: "1px solid",
              borderColor: darkMode
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            }}
          >
            <Toolbar sx={{ minHeight: { xs: 48, sm: 64 } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, display: { sm: "none" } }}
              >
                {mobileOpen ? <MenuOpen fontSize="small" /> : <MenuIcon fontSize="small" />}
              </IconButton>

              <Box
                sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    background: darkMode
                      ? "linear-gradient(90deg, #BB86FC 0%, #03DAC6 100%)"
                      : "linear-gradient(90deg, #6200EE 0%, #03DAC6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.25rem" },
                  }}
                >
                  {getPageTitle()}
                </Typography>
                <Chip
                  label={new Date().toLocaleDateString()}
                  size="small"
                  sx={{
                    ml: 2,
                    display: { xs: "none", md: "flex" },
                    background: darkMode
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                />
                <Box sx={{ flexGrow: 1 }} />
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Account">
                  <IconButton
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <AvatarPulse
                      src={
                        user?.avatar ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      status="online"
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </AppBar>
        </HideOnScroll>

        {/* Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: { xs: "75%", sm: drawerWidth },
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                border: "none",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                boxShadow: darkMode
                  ? "0 0 20px rgba(0,0,0,0.3)"
                  : "0 0 20px rgba(0,0,0,0.05)",
                border: "none",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 1, sm: 2, md: 3 },
            width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
            bgcolor: "background.default",
            transition: "all 0.3s",
            overflow: "auto",
          }}
        >
          <Toolbar sx={{ minHeight: { xs: 48, sm: 64 } }} />

          {/* Routes */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="/" element={<ProfessorHome />} />
                <Route
                  path="/announcements"
                  element={<AnnouncementPage user={user} />}
                />
                <Route
                  path="/createMeetings"
                  element={<CreateMeeting token={token} />}
                />
                <Route
                  path="/ListMeetings"
                  element={<MeetingList token={token} />}
                />
                <Route path="/assignments" element={<Fichier />} />
                <Route path="/quizzes" element={<Quiz />} />
                <Route path="/home" element={<ProfessorHome />} />
                <Route path="/settings" element={<Profile />} />
                <Route path="*" element={<ProfessorHome user={user} />} />
              </Routes>
            </motion.div>
          </AnimatePresence>

          {/* Floating Action Button */}
          <Fade in={fabVisible}>
            <Box
              sx={{
                position: "fixed",
                bottom: { xs: 16, sm: 20 },
                right: { xs: 16, sm: 20 },
                zIndex: 999,
              }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Fab
                  color="primary"
                  aria-label="scroll to top"
                  onClick={scrollToTop}
                  sx={{
                    background: theme.palette.gradient.primary,
                    boxShadow: "0 4px 12px rgba(98, 0, 238, 0.3)",
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                  }}
                >
                  <ArrowUpward fontSize={isMobile ? "small" : "medium"} />
                </Fab>
              </motion.div>
            </Box>
          </Fade>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              width: { xs: 200, sm: 220 },
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
        >
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              pb: 1.5,
              background: darkMode
                ? "linear-gradient(135deg, rgba(98,0,238,0.2) 0%, rgba(187,134,252,0.2) 100%)"
                : "linear-gradient(135deg, rgba(98,0,238,0.05) 0%, rgba(123,31,162,0.05) 100%)",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              {user?.name || "Prof. Alexandra"}
            </Typography>
          </Box>

          <MenuItem
            onClick={() => {
              handleProfileMenuClose();
              navigate("/professor/settings");
            }}
            sx={{ mt: 1 }}
          >
            <ListItemIcon>
              <FingerprintIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              primaryTypographyProps={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            />
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            />
          </MenuItem>
        </Menu>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1,
              width: { xs: 260, sm: 300 },
              maxHeight: 400,
              overflow: "auto",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
            },
          }}
        >
          <Box sx={{ p: { xs: 1.5, sm: 2 }, pb: 1.5 }}>
            <Typography
              variant="subtitle1"
              fontWeight="medium"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Notifications ({notifications.length})
            </Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationMenuClose}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: notification.color,
                  }}
                />
              </ListItemIcon>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {notification.text}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                >
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          {notifications.length === 0 && (
            <MenuItem disabled>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                No new notifications
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default ProfessorDashboard;