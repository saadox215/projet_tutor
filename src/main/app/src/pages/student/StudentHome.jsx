import React from "react"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material"
import {
  Assignment as AssignmentIcon,
  QuestionAnswer as QuizIcon,
  Announcement as AnnouncementIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"

const StudentHome = ({ user }) => {
  // Mock data
  const upcomingAssignments = [
    {
      id: 1,
      title: "Data Structures Assignment 3",
      course: "Data Structures",
      dueDate: "2023-12-15",
      status: "pending",
    },
    { id: 2, title: "Database Design Project", course: "Database Systems", dueDate: "2023-12-18", status: "pending" },
    { id: 3, title: "Algorithm Analysis Report", course: "Algorithms", dueDate: "2023-12-20", status: "pending" },
  ]

  const upcomingQuizzes = [
    { id: 1, title: "Midterm Quiz", course: "Data Structures", date: "2023-12-16", duration: "60 min" },
    { id: 2, title: "SQL Basics", course: "Database Systems", date: "2023-12-19", duration: "45 min" },
  ]

  const recentAnnouncements = [
    {
      id: 1,
      title: "Final Project Guidelines",
      course: "Software Engineering",
      date: "2023-12-10",
      professor: "Dr. Ahmed Hassan",
      avatar: "/placeholder.svg?height=40&width=40&text=AH",
    },
    {
      id: 2,
      title: "Schedule Change for Next Week",
      course: "Data Structures",
      date: "2023-12-09",
      professor: "Dr. Fatima Zahra",
      avatar: "/placeholder.svg?height=40&width=40&text=FZ",
    },
  ]

  const enrolledCourses = [
    { id: 1, name: "Data Structures", code: "CS201", progress: 75, professor: "Dr. Fatima Zahra" },
    { id: 2, name: "Database Systems", code: "CS301", progress: 60, professor: "Dr. Mohammed Alami" },
    { id: 3, name: "Algorithms", code: "CS202", progress: 80, professor: "Dr. Ahmed Hassan" },
    { id: 4, name: "Software Engineering", code: "CS401", progress: 45, professor: "Dr. Laila Bensouda" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Group Project Meeting", date: "2023-12-14", time: "14:00 - 16:00", location: "Online" },
    { id: 2, title: "Office Hours - Dr. Fatima", date: "2023-12-15", time: "10:00 - 12:00", location: "Room 302" },
    { id: 3, title: "Programming Contest", date: "2023-12-17", time: "09:00 - 17:00", location: "Main Auditorium" },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name.split(" ")[0] || "Student"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your courses today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Course Progress */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Courses
            </Typography>
            <Grid container spacing={2}>
              {enrolledCourses.map((course) => (
                <Grid item xs={12} sm={6} key={course.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {course.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.code} • {course.professor}
                          </Typography>
                        </Box>
                        <Chip
                          label={`${course.progress}%`}
                          size="small"
                          color={course.progress >= 70 ? "success" : course.progress >= 40 ? "primary" : "warning"}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          bgcolor: "rgba(0,0,0,0.05)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 5,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button variant="text">View All Courses</Button>
            </Box>
          </Paper>

          {/* Upcoming Assignments */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Upcoming Assignments</Typography>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
            <List>
              {upcomingAssignments.map((assignment, index) => (
                <React.Fragment key={assignment.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assignment.title}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {assignment.course}
                          </Typography>
                          {` — Due: ${assignment.dueDate}`}
                        </React.Fragment>
                      }
                    />
                    <Chip label="Pending" size="small" color="warning" sx={{ alignSelf: "center" }} />
                  </ListItem>
                  {index < upcomingAssignments.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Quizzes */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Quizzes
            </Typography>
            <List dense>
              {upcomingQuizzes.map((quiz) => (
                <ListItem key={quiz.id} sx={{ px: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <QuizIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={quiz.title} secondary={`${quiz.course} • ${quiz.date} • ${quiz.duration}`} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
          </Paper>

          {/* Calendar Events */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Events
            </Typography>
            <List dense>
              {upcomingEvents.map((event) => (
                <ListItem key={event.id} sx={{ px: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "info.main" }}>
                      <CalendarIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={event.title} secondary={`${event.date} • ${event.time} • ${event.location}`} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View Calendar
              </Button>
            </Box>
          </Paper>

          {/* Recent Announcements */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Announcements
            </Typography>
            <List dense>
              {recentAnnouncements.map((announcement) => (
                <ListItem key={announcement.id} alignItems="flex-start" sx={{ px: 1 }}>
                  <ListItemAvatar>
                    <Avatar src={announcement.avatar}>
                      <AnnouncementIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={announcement.title}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {announcement.course}
                        </Typography>
                        {` — ${announcement.professor} • ${announcement.date}`}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StudentHome

