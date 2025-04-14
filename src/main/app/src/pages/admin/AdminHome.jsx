import React from "react"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Chip,
  LinearProgress,
} from "@mui/material"
import {
  Person as UserIcon,
  School as DepartmentIcon,
  Book as CourseIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Storage as ServerIcon,
} from "@mui/icons-material"

const AdminHome = ({ user }) => {
  // Mock data
  const stats = {
    students: 1250,
    professors: 85,
    courses: 120,
    departments: 8,
  }

  const systemStatus = {
    cpu: 32,
    memory: 45,
    storage: 68,
    uptime: "15 days, 7 hours",
  }

  const recentActivities = [
    {
      id: 1,
      user: "Dr. Fatima Zahra",
      avatar: "/placeholder.svg?height=40&width=40&text=FZ",
      action: "created a new course",
      target: "Artificial Intelligence (CS402)",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Admin Mohammed",
      avatar: "/placeholder.svg?height=40&width=40&text=AM",
      action: "added a new professor",
      target: "Dr. Karim Mansouri",
      time: "5 hours ago",
    },
    {
      id: 3,
      user: "System",
      avatar: "/placeholder.svg?height=40&width=40&text=SY",
      action: "performed database backup",
      target: "",
      time: "1 day ago",
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      type: "Professor Account",
      name: "Dr. Youssef Alaoui",
      department: "Computer Science",
      date: "2023-12-10",
    },
    {
      id: 2,
      type: "New Course",
      name: "Mobile Application Development",
      department: "Software Engineering",
      date: "2023-12-09",
    },
    {
      id: 3,
      type: "Department Change",
      name: "Dr. Samira Tazi",
      department: "From Data Science to AI",
      date: "2023-12-08",
    },
  ]

  const alerts = [
    {
      id: 1,
      severity: "warning",
      message: "Storage space is running low (68%)",
      time: "3 hours ago",
    },
    {
      id: 2,
      severity: "error",
      message: "Failed login attempts detected",
      time: "1 day ago",
    },
    {
      id: 3,
      severity: "success",
      message: "System update completed successfully",
      time: "2 days ago",
    },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Administrator Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System overview and management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2 }}>
              <UserIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.students}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Students
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56, mr: 2 }}>
              <UserIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.professors}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Professors
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "info.main", width: 56, height: 56, mr: 2 }}>
              <CourseIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.courses}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Courses
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "success.main", width: 56, height: 56, mr: 2 }}>
              <DepartmentIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {stats.departments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Departments
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">CPU Usage</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {systemStatus.cpu}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={systemStatus.cpu}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Memory Usage</Typography>
                <Typography variant="body2" fontWeight="medium">
                  {systemStatus.memory}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={systemStatus.memory}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Storage Usage</Typography>
                <Typography
                  variant="body2"
                  fontWeight="medium"
                  color={systemStatus.storage > 65 ? "warning.main" : "text.primary"}
                >
                  {systemStatus.storage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={systemStatus.storage}
                color={systemStatus.storage > 65 ? "warning" : "primary"}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: "rgba(0,0,0,0.05)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 5,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ServerIcon sx={{ color: "success.main", mr: 1 }} />
              <Typography variant="body2">System Uptime: {systemStatus.uptime}</Typography>
            </Box>
          </Paper>

          {/* System Alerts */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              System Alerts
            </Typography>
            <List dense>
              {alerts.map((alert) => (
                <ListItem key={alert.id} sx={{ px: 1, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor:
                          alert.severity === "error"
                            ? "error.main"
                            : alert.severity === "warning"
                              ? "warning.main"
                              : "success.main",
                      }}
                    >
                      {alert.severity === "error" || alert.severity === "warning" ? (
                        <WarningIcon />
                      ) : (
                        <CheckCircleIcon />
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={alert.message} secondary={alert.time} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View All Alerts
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Pending Approvals */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Pending Approvals</Typography>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
            <List>
              {pendingApprovals.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Chip label={item.type} size="small" color="primary" sx={{ mr: 1 }} />
                          <Typography variant="body1" component="span">
                            {item.name}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {item.department}
                          </Typography>
                          {` — Submitted: ${item.date}`}
                        </React.Fragment>
                      }
                    />
                    <Box sx={{ display: "flex", gap: 1, alignSelf: "center" }}>
                      <Button size="small" variant="contained" color="success">
                        Approve
                      </Button>
                      <Button size="small" variant="outlined" color="error">
                        Reject
                      </Button>
                    </Box>
                  </ListItem>
                  {index < pendingApprovals.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Recent Activities */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={activity.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          <Typography component="span" fontWeight="medium">
                            {activity.user}
                          </Typography>{" "}
                          {activity.action}{" "}
                          <Typography component="span" fontWeight="medium">
                            {activity.target}
                          </Typography>
                        </Typography>
                      }
                      secondary={activity.time}
                    />
                  </ListItem>
                  {index < recentActivities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View Activity Log
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminHome

