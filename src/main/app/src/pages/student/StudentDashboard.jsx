"use client"

import { useState } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
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
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  QuestionAnswer as QuizIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  Logout,
  CalendarMonth,
  Forum,
  School,
} from "@mui/icons-material"

import StudentHome from "./StudentHome"
import StudentCourses from "./StudentCourses"
import StudentAssignments from "./StudentAssignments"
import StudentQuizzes from "./StudentQuizzes"

const drawerWidth = 240

const StudentDashboard = ({ user, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null)
  }

  const handleLogout = () => {
    handleProfileMenuClose()
    onLogout()
    navigate("/login")
  }

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/student" },
    { text: "Annoncement", icon: <BookIcon />, path: "/student/annonce" },
    { text: "Assignments", icon: <AssignmentIcon />, path: "/student/assignments" },
    { text: "Quizzes", icon: <QuizIcon />, path: "/student/quizzes" },
    { text: "Calendar", icon: <CalendarMonth />, path: "/student/calendar" },
    { text: "Discussion", icon: <Forum />, path: "/student/discussion" },
  ]

  const notifications = [
    { id: 1, text: "New assignment posted in Data Structures", time: "2 hours ago" },
    { id: 2, text: "Quiz reminder: Algorithms Quiz tomorrow", time: "5 hours ago" },
    { id: 3, text: "Prof. Ahmed commented on your submission", time: "1 day ago" },
  ]

  const drawer = (
    <div>
      <Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 1 }}>
        <School color="primary" sx={{ fontSize: 30, mr: 1 }} />
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          SmartClass
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Avatar src={user?.avatar || "/placeholder.svg?height=40&width=40"} sx={{ width: 40, height: 40, mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {user?.name || "Student"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Student
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/student/settings")}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Tooltip title="Notifications">
              <IconButton size="large" color="inherit" onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton size="large" edge="end" aria-haspopup="true" onClick={handleProfileMenuOpen} color="inherit">
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<StudentHome user={user} />} />
          <Route path="/annonce" element={<StudentCourses />} />
          <Route path="/assignments" element={<StudentAssignments />} />
          <Route path="/quizzes" element={<StudentQuizzes />} />
          <Route path="*" element={<StudentHome user={user} />} />
        </Routes>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleProfileMenuClose()
            navigate("/student/profile")
          }}
        >
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose()
            navigate("/student/settings")
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Notifications
          </Typography>
        </Box>
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationMenuClose} sx={{ py: 1.5 }}>
            <Box>
              <Typography variant="body2">{notification.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="primary">
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default StudentDashboard

