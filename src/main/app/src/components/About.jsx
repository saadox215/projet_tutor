import React, { useState, useEffect, useRef } from "react"
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Paper, 
  ThemeProvider, 
  createTheme 
} from "@mui/material"
import { School, LocationOn } from "@mui/icons-material"

// Importez l'image directement
import imageEcole from "../assets/ensakh.png"

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Deep blue
    },
    secondary: {
      main: '#00bcd4', // Cyan
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h5: {
      fontWeight: 500,
    },
  },
})

const About = () => {
  const [isVisible, setIsVisible] = useState(false)
  const aboutRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entries[0].target)
        }
      },
      { threshold: 0.1 },
    )

    if (aboutRef.current) {
      observer.observe(aboutRef.current)
    }

    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current)
      }
    }
  }, [])

  // Features list for mapping
  const features = [
    { 
      title: "Modern Education", 
      value: "Blending traditional teaching with digital innovation" 
    },
    { 
      title: "Seamless Interaction", 
      value: "Direct communication between professors and students" 
    },
    { 
      title: "Comprehensive Tools", 
      value: "Everything needed for effective teaching and learning" 
    },
    { 
      title: "Secure Environment", 
      value: "Protected academic space with role-based access" 
    },
  ]

  return (
    <ThemeProvider theme={theme}>
      <Box
        id="about"
        ref={aboutRef}
        sx={{
          py: 10,
          backgroundColor: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: { xs: "150px", md: "300px" },
            height: { xs: "150px", md: "300px" },
            background: "linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(0, 188, 212, 0.1) 100%)",
            borderRadius: "0 0 0 100%",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: { xs: "150px", md: "300px" },
            height: { xs: "150px", md: "300px" },
            background: "linear-gradient(135deg, rgba(245, 0, 87, 0.1) 0%, rgba(255, 64, 129, 0.1) 100%)",
            borderRadius: "0 100% 0 0",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Image Section */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-50px)",
                transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <img 
                  src={imageEcole} 
                  alt="ENSA Khouribga" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    bottom: { xs: "-30px", md: "-40px" },
                    right: { xs: "-20px", md: "-40px" },
                    p: { xs: 2, md: 3 },
                    borderRadius: "15px",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    maxWidth: { xs: "80%", md: "60%" },
                  }}
                >
                  <School color="primary" sx={{ fontSize: { xs: 30, md: 40 } }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ENSA Khouribga
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      École Nationale des Sciences Appliquées
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Description Section */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(50px)",
                transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
              }}
            >
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: "linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                About SmartClass
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, color: "text.secondary" }}>
                Revolutionizing education at ENSA Khouribga
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", lineHeight: 1.8 }}>
                SmartClass is a comprehensive educational platform designed specifically for ENSA Khouribga to bridge the
                gap between traditional and digital learning. Our mission is to create an intuitive and powerful
                environment where professors and students can interact seamlessly.
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: "text.secondary", lineHeight: 1.8 }}>
                The platform centralizes course materials, assignments, evaluations, and communication in one place,
                making education more accessible, organized, and effective for everyone involved.
              </Typography>

              {/* Features Grid */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                {features.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Location Section */}
          <Box sx={{ mt: 8 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 4, 
                textAlign: 'center',
                background: "linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <LocationOn sx={{ verticalAlign: 'middle', mr: 1 }} /> 
              Notre Localisation
            </Typography>
            <Box 
              sx={{ 
                width: '100%', 
                height: { xs: 250, md: 400 }, 
                borderRadius: '15px', 
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.5835310863417!2d-6.915489004163523!3d32.89661295924229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda69d51a4eccd09%3A0x2fe5964c283fb57a!2s%C3%89cole%20Nationale%20des%20Sciences%20Appliqu%C3%A9es%20de%20Khouribga!5e0!3m2!1sfr!2sma!4v1743024566322!5m2!1sfr!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default About