"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  CloudUpload as UploadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Sort as SortIcon,
} from "@mui/icons-material"

const StudentAssignments = () => {
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleMenuOpen = (event, assignment) => {
    setAnchorEl(event.currentTarget)
    setSelectedAssignment(assignment)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Mock data
  const assignments = [
    {
      id: 1,
      title: "Data Structures Assignment 3",
      course: "Data Structures",
      courseCode: "CS201",
      dueDate: "2023-12-15",
      status: "pending",
      description: "Implement a balanced binary search tree and analyze its performance.",
      points: 100,
      submissionType: "File Upload",
      attachments: ["assignment3.pdf"],
    },
    {
      id: 2,
      title: "Database Design Project",
      course: "Database Systems",
      courseCode: "CS301",
      dueDate: "2023-12-18",
      status: "pending",
      description: "Design and implement a relational database for a hospital management system.",
      points: 150,
      submissionType: "File Upload + URL",
      attachments: ["project_guidelines.pdf", "sample_data.sql"],
    },
    {
      id: 3,
      title: "Algorithm Analysis Report",
      course: "Algorithms",
      courseCode: "CS202",
      dueDate: "2023-12-20",
      status: "pending",
      description: "Analyze the time and space complexity of sorting algorithms.",
      points: 80,
      submissionType: "File Upload",
      attachments: ["report_template.docx"],
    },
    {
      id: 4,
      title: "UI/UX Design Principles",
      course: "Software Engineering",
      courseCode: "CS401",
      dueDate: "2023-12-10",
      status: "submitted",
      submittedDate: "2023-12-09",
      grade: null,
      description: "Create wireframes and prototypes for a mobile application.",
      points: 120,
      submissionType: "File Upload + URL",
      attachments: ["design_guidelines.pdf"],
    },
    {
      id: 5,
      title: "Midterm Programming Assignment",
      course: "Data Structures",
      courseCode: "CS201",
      dueDate: "2023-11-15",
      status: "graded",
      submittedDate: "2023-11-14",
      grade: 92,
      feedback: "Excellent work! Your implementation is efficient and well-documented.",
      description: "Implement a priority queue using a heap data structure.",
      points: 100,
      submissionType: "File Upload",
      attachments: ["midterm_assignment.pdf"],
    },
    {
      id: 6,
      title: "SQL Query Optimization",
      course: "Database Systems",
      courseCode: "CS301",
      dueDate: "2023-11-20",
      status: "graded",
      submittedDate: "2023-11-19",
      grade: 85,
      feedback: "Good work, but some queries could be more optimized.",
      description: "Optimize a set of SQL queries for better performance.",
      points: 80,
      submissionType: "File Upload",
      attachments: ["query_optimization.pdf"],
    },
  ]

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.courseCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingAssignments = filteredAssignments.filter((assignment) => assignment.status === "pending")
  const submittedAssignments = filteredAssignments.filter((assignment) => assignment.status === "submitted")
  const gradedAssignments = filteredAssignments.filter((assignment) => assignment.status === "graded")

  const getStatusChip = (status, grade = null) => {
    switch (status) {
      case "pending":
        return <Chip label="Pending" color="warning" size="small" />
      case "submitted":
        return <Chip label="Submitted" color="info" size="small" />
      case "graded":
        return (
          <Chip
            label={`Graded: ${grade}/100`}
            color={grade >= 90 ? "success" : grade >= 70 ? "primary" : "error"}
            size="small"
          />
        )
      default:
        return null
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Assignments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your course assignments and submissions
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search assignments by title, course, or code"
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
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="assignment tabs">
            <Tab label={`Pending (${pendingAssignments.length})`} />
            <Tab label={`Submitted (${submittedAssignments.length})`} />
            <Tab label={`Graded (${gradedAssignments.length})`} />
            <Tab label="All" />
          </Tabs>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Title
                    <IconButton size="small">
                      <SortIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Course</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    Due Date
                    <IconButton size="small">
                      <SortIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Points</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tabValue === 0
                ? pendingAssignments
                : tabValue === 1
                  ? submittedAssignments
                  : tabValue === 2
                    ? gradedAssignments
                    : filteredAssignments
              ).map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>
                    {assignment.course} ({assignment.courseCode})
                  </TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>{getStatusChip(assignment.status, assignment.grade)}</TableCell>
                  <TableCell>{assignment.points}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(event) => handleMenuOpen(event, assignment)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        {selectedAssignment?.status === "pending" && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <UploadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Submit Assignment</ListItemText>
          </MenuItem>
        )}
        {selectedAssignment?.status === "submitted" && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Submission</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download Attachments</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default StudentAssignments

