"use client"
import { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Menu from "@mui/material/Menu"
import MenuIcon from "@mui/icons-material/Menu"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import MenuItem from "@mui/material/MenuItem"
import { School } from "@mui/icons-material"
import { useTheme } from "@mui/material/styles"
import Avatar from "@mui/material/Avatar"
import logo from "../assets/logo.png"

const pages = ["Home", "Features", "About", "Demo", "Contact"]

function Navbar({ scrolled, user, onLogout }) {
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const theme = useTheme()
  const navigate = useNavigate()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = () => {
    handleCloseUserMenu()
    onLogout()
    navigate("/")
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    handleCloseNavMenu()
  }

  const navigateToDashboard = () => {
    handleCloseUserMenu()
    if (user) {
      navigate(`/${user.role}`)
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "white" : "transparent",
        boxShadow: scrolled ? 1 : "none",
        transition: "all 0.3s ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                maxHeight: "100px",
                objectFit: "contain",
              }}
            />
          </Box>
          

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color={scrolled ? "primary" : "inherit"}
            >
              <MenuIcon sx={{ color: scrolled ? theme.palette.primary.main : "white" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => scrollToSection(page.toLowerCase())}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              flexGrow: 1,
            }}
          >
            
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Poppins",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: scrolled ? theme.palette.primary.main : "white",
              textDecoration: "none",
            }}
          >
            SmartClass
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => scrollToSection(page.toLowerCase())}
                sx={{
                  my: 2,
                  mx: 1,
                  color: scrolled ? theme.palette.primary.main : "white",
                  display: "block",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.name}
                    src={user.avatar || "/placeholder.svg?height=40&width=40"}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      border: "2px solid",
                      borderColor: scrolled ? theme.palette.primary.main : "white",
                    }}
                  />
                </IconButton>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={navigateToDashboard}>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: "30px",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  boxShadow: 3,
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar

