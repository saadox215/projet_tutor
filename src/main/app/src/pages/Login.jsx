import React, { useState } from "react"
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
  Divider,
  Alert,
  Snackbar,
} from "@mui/material"
import { Visibility, VisibilityOff, School, LockOpen, ArrowBack } from "@mui/icons-material"

const EnhancedLogin = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      setOpenSnackbar(true)
      return
    }

    try {
      setLoading(true)
      
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      // Extract role from authorities
      const userRole = determineUserRole(data.authorities)
      
      // Create user data object from response
      const userData = {
        id: extractIdFromToken(data.token), // Optional: extract from token if needed
        email: data.email,
        name: data.email.split("@")[0], // Simple name extraction
        role: userRole,
        token: data.token,
        avatar: `/placeholder.svg?height=100&width=100&text=${data.email.charAt(0).toUpperCase()}`,
        authorities: data.authorities
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
      
      onLogin(userData)
      navigate(`/${userRole}`)
    } catch (error) {
      setError("Authentication failed. Please check your credentials.")
      setOpenSnackbar(true)
    } finally {
      setLoading(false)
    }
  }

  const determineUserRole = (authorities) => {
    if (!authorities || authorities.length === 0) return "student"
    
    const authList = authorities.map(auth => 
      typeof auth === 'string' ? auth : auth.authority
    )
    
    if (authList.some(auth => auth.includes("ADMIN"))) return "admin"
    if (authList.some(auth => auth.includes("PROFESSEUR"))) return "professor"
    return "student"
  }

  const extractIdFromToken = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      
      return JSON.parse(jsonPayload).sub || Math.floor(Math.random() * 1000)
    } catch (e) {
      return Math.floor(Math.random() * 1000) // Fallback
    }
  }

  

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(63, 81, 181, 0.9) 0%, rgba(0, 188, 212, 0.9) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Back Button */}
      <Box 
        sx={{
          position: "absolute", 
          top: 20, 
          left: 20, 
          zIndex: 20
        }}
      >
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<ArrowBack />}
          onClick={handleBackToHome}
          sx={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.3)',
            }
          }}
        >
          Back to Home
        </Button>
      </Box>

      {/* Floating Decorative Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "300px",
          height: "300px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          transform: "rotate(45deg)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-5%",
          width: "250px",
          height: "250px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "50%",
          transform: "rotate(-45deg)",
        }}
      />

      <Container maxWidth="md">
        <Paper
          elevation={20}
          sx={{
            display: "flex",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Image Side */}
          <Box
            sx={{
              width: "50%",
              background: "url('/api/placeholder/800/1000?text=SmartClass+Learning')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(135deg, rgba(63, 81, 181, 0.7) 0%, rgba(0, 188, 212, 0.7) 100%)",
              }
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
                zIndex: 10,
              }}
            >
              <School sx={{ fontSize: 100, color: "white", mb: 2 }} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                SmartClass
              </Typography>
              <Typography variant="subtitle1">
                Your Smart Learning Companion
              </Typography>
            </Box>
          </Box>

          {/* Login Form Side */}
          <Box
            sx={{
              width: "50%",
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              background: "white",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <LockOpen color="primary" sx={{ fontSize: 50, mb: 1 }} />
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to access your dashboard
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
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
              <Box sx={{ textAlign: "right", mb: 2 }}>
                <Link component={RouterLink} to="#" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                disabled={loading}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)",
                  '&:hover': {
                    background: "linear-gradient(135deg, #3f51b5 50%, #00bcd4 100%)"
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>


           
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

export default EnhancedLogin