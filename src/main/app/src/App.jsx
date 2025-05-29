"use client"

import { useState, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import StudentDashboard from "./pages/student/StudentDashboard.jsx"
import ProfessorDashboard from "./pages/professor/ProfessorDashboard.jsx"
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import LandingPage from "./pages/LandingPage.jsx"
import "./App.css"

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "30px",
          padding: "10px 20px",
          fontWeight: 600,
        },
      },
    },
  },
})

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LandingPage  onLogout={handleLogout} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />

            <Route
              path="/student/*"
              element={
                <ProtectedRoute user={user} requiredRole="student">
                  <StudentDashboard user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/professor/*"
              element={
                <ProtectedRoute user={user} requiredRole="professor">
                  <ProfessorDashboard user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute user={user} requiredRole="admin">
                  <AdminDashboard user={user} onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App