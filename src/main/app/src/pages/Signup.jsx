"use client"

import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
} from "@mui/material"
import { Visibility, VisibilityOff, School, ArrowBack, ArrowForward } from "@mui/icons-material"

const steps = ["Account Type", "Personal Information", "Account Details"]

const Signup = ({ onLogin }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    studentId: "",
    department: "",
    year: "",
    professorId: "",
    specialization: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0 && !formData.role) {
      setError("Please select an account type")
      setOpenSnackbar(true)
      return
    }

    if (activeStep === 1) {
      if (!formData.firstName || !formData.lastName) {
        setError("Please fill in all required fields")
        setOpenSnackbar(true)
        return
      }
    }

    if (activeStep === 2) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields")
        setOpenSnackbar(true)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setOpenSnackbar(true)
        return
      }

      // Submit the form
      handleSubmit()
      return
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSubmit = () => {
    // Mock signup - in a real app, this would be an API call
    const userData = {
      id: Math.floor(Math.random() * 1000),
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      avatar: `/placeholder.svg?height=100&width=100&text=${formData.firstName.charAt(0).toUpperCase()}${formData.lastName.charAt(0).toUpperCase()}`,
    }

    onLogin(userData)
    navigate(`/${formData.role}`)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Account Type
            </Typography>
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Account Type</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Account Type"
                onChange={handleChange}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </Select>
            </FormControl>

            {formData.role === "student" && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  id="studentId"
                  label="Student ID"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="department"
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="year"
                  label="Year of Study"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                />
              </>
            )}

            {formData.role === "professor" && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  id="professorId"
                  label="Professor ID"
                  name="professorId"
                  value={formData.professorId}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="specialization"
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </>
            )}
          </Box>
        )
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Account Details
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Box>
        )
      default:
        return "Unknown step"
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.12)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <School color="primary" sx={{ fontSize: 50, mb: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join SmartClass to enhance your educational experience
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getStepContent(activeStep)}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBack />}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
            >
              {activeStep === steps.length - 1 ? "Sign Up" : "Next"}
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Signup

