"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
} from "@mui/icons-material"

const StudentCourses = () => {
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [bookmarkedCourses, setBookmarkedCourses] = useState([1, 3])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const toggleBookmark = (courseId) => {
    if (bookmarkedCourses.includes(courseId)) {
      setBookmarkedCourses(bookmarkedCourses.filter((id) => id !== courseId))
    } else {
      setBookmarkedCourses([...bookmarkedCourses, courseId])
    }
  }

  // Mock data
  const enrolledCourses = [
    {
      id: 1,
      name: "Data Structures and Algorithms",
      code: "CS201",
      professor: "Dr. Fatima Zahra",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=FZ",
      description: "Learn about fundamental data structures and algorithms used in computer science.",
      image: "/placeholder.svg?height=200&width=400&text=Data+Structures",
      progress: 75,
      students: 120,
      credits: 4,
      schedule: "Mon, Wed 10:00 - 11:30",
      tags: ["Computer Science", "Programming"],
    },
    {
      id: 2,
      name: "Database Systems",
      code: "CS301",
      professor: "Dr. Mohammed Alami",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=MA",
      description: "Introduction to database design, implementation, and management systems.",
      image: "/placeholder.svg?height=200&width=400&text=Database+Systems",
      progress: 60,
      students: 95,
      credits: 3,
      schedule: "Tue, Thu 13:00 - 14:30",
      tags: ["Database", "SQL"],
    },
    {
      id: 3,
      name: "Algorithm Analysis",
      code: "CS202",
      professor: "Dr. Ahmed Hassan",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=AH",
      description: "Advanced analysis of algorithm efficiency and complexity theory.",
      image: "/placeholder.svg?height=200&width=400&text=Algorithm+Analysis",
      progress: 80,
      students: 85,
      credits: 3,
      schedule: "Wed, Fri 15:00 - 16:30",
      tags: ["Algorithms", "Theory"],
    },
    {
      id: 4,
      name: "Software Engineering",
      code: "CS401",
      professor: "Dr. Laila Bensouda",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=LB",
      description: "Principles and practices of software development and project management.",
      image: "/placeholder.svg?height=200&width=400&text=Software+Engineering",
      progress: 45,
      students: 110,
      credits: 4,
      schedule: "Mon, Thu 08:30 - 10:00",
      tags: ["Project Management", "Development"],
    },
  ]

  const availableCourses = [
    {
      id: 5,
      name: "Artificial Intelligence",
      code: "CS402",
      professor: "Dr. Karim Mansouri",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=KM",
      description: "Introduction to AI concepts, machine learning, and neural networks.",
      image: "/placeholder.svg?height=200&width=400&text=Artificial+Intelligence",
      students: 75,
      credits: 4,
      schedule: "Tue, Fri 10:00 - 11:30",
      tags: ["AI", "Machine Learning"],
    },
    {
      id: 6,
      name: "Computer Networks",
      code: "CS303",
      professor: "Dr. Youssef Alaoui",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=YA",
      description: "Fundamentals of computer networking, protocols, and network security.",
      image: "/placeholder.svg?height=200&width=400&text=Computer+Networks",
      students: 90,
      credits: 3,
      schedule: "Mon, Wed 13:00 - 14:30",
      tags: ["Networking", "Security"],
    },
    {
      id: 7,
      name: "Web Development",
      code: "CS304",
      professor: "Dr. Samira Tazi",
      professorAvatar: "/placeholder.svg?height=40&width=40&text=ST",
      description: "Modern web development techniques, frameworks, and best practices.",
      image: "/placeholder.svg?height=200&width=400&text=Web+Development",
      students: 130,
      credits: 3,
      schedule: "Tue, Thu 15:00 - 16:30",
      tags: ["Web", "JavaScript"],
    },
  ]

  const filteredEnrolledCourses = enrolledCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAvailableCourses = availableCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.professor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse your enrolled courses and discover new ones
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search courses by name, code, or professor"
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

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="course tabs">
          <Tab label="Enrolled Courses" />
          <Tab label="Available Courses" />
          <Tab label="Bookmarked" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {filteredEnrolledCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia component="img" height="140" image={course.image} alt={course.name} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="h6" component="div">
                      {course.name}
                    </Typography>
                    <IconButton size="small" onClick={() => toggleBookmark(course.id)} color="primary">
                      {bookmarkedCourses.includes(course.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.code} • {course.credits} Credits
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar src={course.professorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2">{course.professor}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                    {course.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Schedule:</strong> {course.schedule}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" color="primary">
                    View Course
                  </Button>
                  <Button size="small">Materials</Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <Chip
                    label={`${course.progress}%`}
                    size="small"
                    color={course.progress >= 70 ? "success" : course.progress >= 40 ? "primary" : "warning"}
                  />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {filteredAvailableCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia component="img" height="140" image={course.image} alt={course.name} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="h6" component="div">
                      {course.name}
                    </Typography>
                    <IconButton size="small" onClick={() => toggleBookmark(course.id)} color="primary">
                      {bookmarkedCourses.includes(course.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.code} • {course.credits} Credits
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar src={course.professorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                    <Typography variant="body2">{course.professor}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {course.description}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                    {course.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Schedule:</strong> {course.schedule}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button size="small" color="primary" variant="contained">
                    Enroll
                  </Button>
                  <Button size="small">Details</Button>
                  <Box sx={{ flexGrow: 1 }} />
                  <Chip label={`${course.students} students`} size="small" variant="outlined" />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          {[...filteredEnrolledCourses, ...filteredAvailableCourses]
            .filter((course) => bookmarkedCourses.includes(course.id))
            .map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia component="img" height="140" image={course.image} alt={course.name} />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography variant="h6" component="div">
                        {course.name}
                      </Typography>
                      <IconButton size="small" onClick={() => toggleBookmark(course.id)} color="primary">
                        <BookmarkedIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {course.code} • {course.credits} Credits
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Avatar src={course.professorAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2">{course.professor}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {course.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
                      {course.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions>
                    <Button size="small" color="primary">
                      View Course
                    </Button>
                    <Button size="small">Materials</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  )
}

export default StudentCourses

