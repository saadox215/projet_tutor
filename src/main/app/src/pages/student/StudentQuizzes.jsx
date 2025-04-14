"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
  School as CourseIcon,
  PlayArrow as StartIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material"

const StudentQuizzes = () => {
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Mock data
  const quizzes = [
    {
      id: 1,
      title: "Midterm Quiz",
      course: "Data Structures",
      courseCode: "CS201",
      date: "2023-12-16",
      time: "10:00 - 11:00",
      duration: 60,
      status: "upcoming",
      questions: 30,
      points: 100,
      description: "This quiz covers topics from weeks 1-7 including arrays, linked lists, stacks, and queues.",
      instructor: "Dr. Fatima Zahra",
      instructorAvatar: "/placeholder.svg?height=40&width=40&text=FZ",
    },
    {
      id: 2,
      title: "SQL Basics",
      course: "Database Systems",
      courseCode: "CS301",
      date: "2023-12-19",
      time: "14:00 - 14:45",
      duration: 45,
      status: "upcoming",
      questions: 20,
      points: 60,
      description: "Test your knowledge of basic SQL queries, joins, and database normalization.",
      instructor: "Dr. Mohammed Alami",
      instructorAvatar: "/placeholder.svg?height=40&width=40&text=MA",
    },
    {
      id: 3,
      title: "Algorithm Complexity",
      course: "Algorithms",
      courseCode: "CS202",
      date: "2023-12-05",
      time: "09:00 - 10:00",
      duration: 60,
      status: "completed",
      score: 85,
      totalScore: 100,
      questions: 25,
      points: 80,
      description: "Assessment on Big O notation, time complexity, and space complexity analysis.",
      instructor: "Dr. Ahmed Hassan",
      instructorAvatar: "/placeholder.svg?height=40&width=40&text=AH",
    },
    {
      id: 4,
      title: "Software Design Patterns",
      course: "Software Engineering",
      courseCode: "CS401",
      date: "2023-12-01",
      time: "13:00 - 14:00",
      duration: 60,
      status: "completed",
      score: 92,
      totalScore: 100,
      questions: 30,
      points: 90,
      description: "Quiz on common design patterns, SOLID principles, and software architecture.",
      instructor: "Dr. Laila Bensouda",
      instructorAvatar: "/placeholder.svg?height=40&width=40&text=LB",
    },
    {
      id: 5,
      title: "Database Normalization",
      course: "Database Systems",
      courseCode: "CS301",
      date: "2023-11-15",
      time: "11:00 - 12:00",
      duration: 60,
      status: "completed",
      score: 78,
      totalScore: 100,
      questions: 25,
      points: 75,
      description: "Assessment on database normalization forms and relational algebra.",
      instructor: "Dr. Mohammed Alami",
      instructorAvatar: "/placeholder.svg?height=40&width=40&text=MA",
    },
  ]

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.courseCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const upcomingQuizzes = filteredQuizzes.filter((quiz) => quiz.status === "upcoming")
  const completedQuizzes = filteredQuizzes.filter((quiz) => quiz.status === "completed")

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quizzes & Exams
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your upcoming and completed quizzes and exams
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search quizzes by title, course, or code"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: "white" }}
        />
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="quiz tabs">
            <Tab label={`Upcoming (${upcomingQuizzes.length})`} />
            <Tab label={`Completed (${completedQuizzes.length})`} />
            <Tab label="All" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {(tabValue === 0 ? upcomingQuizzes : tabValue === 1 ? completedQuizzes : filteredQuizzes).map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {quiz.title}
                      </Typography>
                      <Chip
                        label={quiz.status === "upcoming" ? "Upcoming" : "Completed"}
                        color={quiz.status === "upcoming" ? "warning" : "success"}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CourseIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">
                        {quiz.course} ({quiz.courseCode})
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">
                        {quiz.date}, {quiz.time}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <TimerIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">Duration: {quiz.duration} minutes</Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {quiz.description}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar src={quiz.instructorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2">{quiz.instructor}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2">Questions: {quiz.questions}</Typography>
                      <Typography variant="body2">Points: {quiz.points}</Typography>
                    </Box>

                    {quiz.status === "completed" && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Score: {quiz.score}/{quiz.totalScore}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color={
                              quiz.score / quiz.totalScore >= 0.9
                                ? "success.main"
                                : quiz.score / quiz.totalScore >= 0.7
                                  ? "primary.main"
                                  : "error.main"
                            }
                          >
                            {Math.round((quiz.score / quiz.totalScore) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(quiz.score / quiz.totalScore) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                            bgcolor: "rgba(0,0,0,0.05)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              bgcolor:
                                quiz.score / quiz.totalScore >= 0.9
                                  ? "success.main"
                                  : quiz.score / quiz.totalScore >= 0.7
                                    ? "primary.main"
                                    : "error.main",
                            },
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                  <Divider />
                  <CardActions>
                    {quiz.status === "upcoming" ? (
                      <>
                        <Button size="small" variant="contained" color="primary" startIcon={<StartIcon />}>
                          Start Quiz
                        </Button>
                        <Button size="small">View Details</Button>
                      </>
                    ) : (
                      <>
                        <Button size="small" variant="outlined" color="primary" startIcon={<ViewIcon />}>
                          Review Answers
                        </Button>
                        <Button size="small">View Details</Button>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  )
}

export default StudentQuizzes

