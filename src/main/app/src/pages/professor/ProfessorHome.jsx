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
  Chip,
  IconButton,
} from "@mui/material"
import {
  Assignment as AssignmentIcon,
  Book as CourseIcon,
  QuestionAnswer as QuizIcon,
  Announcement as AnnouncementIcon,
  People as StudentsIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material"

const ProfessorHome = ({ user }) => {
  // Mock data
  const courses = [
    { id: 1, name: "Data Structures", code: "CS201", students: 120, sections: 2 },
    { id: 2, name: "Database Systems", code: "CS301", students: 95, sections: 1 },
    { id: 3, name: "Algorithm Analysis", code: "CS202", students: 85, sections: 1 },
  ]

  const pendingGrading = [
    { id: 1, title: "Data Structures Assignment 3", course: "CS201", submissions: 98, dueDate: "2023-12-10" },
    { id: 2, name: "Database Design Project", course: "CS301", submissions: 75, dueDate: "2023-12-12" },
  ]

  const upcomingQuizzes = [
    { id: 1, title: "Midterm Quiz", course: "CS201", date: "2023-12-16", students: 120 },
    { id: 2, title: "SQL Basics", course: "CS301", date: "2023-12-19", students: 95 },
  ]

  const recentAnnouncements = [
    {
      id: 1,
      title: "Final Project Guidelines",
      course: "CS201",
      date: "2023-12-10",
      views: 112,
    },
    {
      id: 2,
      title: "Schedule Change for Next Week",
      course: "CS301",
      date: "2023-12-09",
      views: 87,
    },
  ]

  const studentRequests = [
    {
      id: 1,
      name: "Ahmed Hassan",
      avatar: "/placeholder.svg?height=40&width=40&text=AH",
      request: "Meeting request to discuss final project",
      date: "2023-12-11",
      course: "CS201",
    },
    {
      id: 2,
      name: "Fatima Zahra",
      avatar: "/placeholder.svg?height=40&width=40&text=FZ",
      request: "Extension request for Assignment 3",
      date: "2023-12-10",
      course: "CS301",
    },
    {
      id: 3,
      name: "Mohammed Ali",
      avatar: "/placeholder.svg?height=40&width=40&text=MA",
      request: "Question about quiz format",
      date: "2023-12-09",
      course: "CS201",
    },
  ]

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.name.split(" ")[0] || "Professor"}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your teaching activities
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2 }}>
              <CourseIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {courses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Courses
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "secondary.main", width: 56, height: 56, mr: 2 }}>
              <StudentsIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56, mr: 2 }}>
              <AssignmentIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {pendingGrading.reduce((sum, item) => sum + item.submissions, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending Submissions
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, display: "flex", alignItems: "center", height: "100%" }}>
            <Avatar sx={{ bgcolor: "info.main", width: 56, height: 56, mr: 2 }}>
              <QuizIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {upcomingQuizzes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming Quizzes
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* My Courses */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">My Courses</Typography>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} size="small">
                Add Course
              </Button>
            </Box>
            <Grid container spacing={2}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Typography variant="h6" component="div">
                          {course.name}
                        </Typography>
                        <IconButton size="small">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {course.code}
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Chip label={`${course.students} Students`} size="small" color="primary" variant="outlined" />
                        <Chip
                          label={`${course.sections} ${course.sections > 1 ? "Sections" : "Section"}`}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Button variant="text">View All Courses</Button>
            </Box>
          </Paper>

          {/* Pending Grading */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Pending Grading</Typography>
              <Button variant="text" size="small">
                View All
              </Button>
            </Box>
            <List>
              {pendingGrading.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "warning.main" }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {item.course}
                          </Typography>
                          {` — Due: ${item.dueDate}`}
                        </React.Fragment>
                      }
                    />
                    <Chip
                      label={`${item.submissions} Submissions`}
                      size="small"
                      color="warning"
                      sx={{ alignSelf: "center" }}
                    />
                  </ListItem>
                  {index < pendingGrading.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>

          {/* Upcoming Quizzes */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Upcoming Quizzes</Typography>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} size="small">
                Create Quiz
              </Button>
            </Box>
            <List>
              {upcomingQuizzes.map((quiz, index) => (
                <React.Fragment key={quiz.id}>
                  <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "info.main" }}>
                        <QuizIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={quiz.title}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {quiz.course}
                          </Typography>
                          {` — Date: ${quiz.date}`}
                        </React.Fragment>
                      }
                    />
                    <Chip label={`${quiz.students} Students`} size="small" color="info" sx={{ alignSelf: "center" }} />
                  </ListItem>
                  {index < upcomingQuizzes.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Student Requests */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Student Requests
            </Typography>
            <List dense>
              {studentRequests.map((request, index) => (
                <React.Fragment key={request.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar src={request.avatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={request.name}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {request.request}
                          </Typography>
                          {` — ${request.course} • ${request.date}`}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < studentRequests.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View All Requests
              </Button>
            </Box>
          </Paper>

          {/* Recent Announcements */}
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6">Recent Announcements</Typography>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} size="small">
                New
              </Button>
            </Box>
            <List dense>
              {recentAnnouncements.map((announcement, index) => (
                <React.Fragment key={announcement.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "secondary.main" }}>
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
                          {` — ${announcement.date}`}
                        </React.Fragment>
                      }
                    />
                    <Chip
                      label={`${announcement.views} views`}
                      size="small"
                      variant="outlined"
                      sx={{ alignSelf: "center" }}
                    />
                  </ListItem>
                  {index < recentAnnouncements.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Button variant="text" size="small">
                View All Announcements
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ProfessorHome

