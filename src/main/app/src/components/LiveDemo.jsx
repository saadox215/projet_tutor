;("use client")

import { useState, useEffect, useRef } from "react"
import { Container, Grid, Typography, Box, Button, Paper, Tabs, Tab } from "@mui/material"
import { Videocam, Assignment, QuestionAnswer, Announcement } from "@mui/icons-material"
import live from "../assets/live-class.jpg"
import ass from "../assets/ass.jpg"
import qui from "../assets/qui.webp"
import ann from "../assets/annonce.jpg"

const LiveDemo = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const demoRef = useRef(null)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

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

    if (demoRef.current) {
      observer.observe(demoRef.current)
    }

    return () => {
      if (demoRef.current) {
        observer.unobserve(demoRef.current)
      }
    }
  }, [])

  const demoContent = [
    {
      title: "Live Classes",
      icon: <Videocam fontSize="large" color="primary" />,
      description: "Conduct interactive live classes with real-time chat, screen sharing, and recording capabilities.",
      image: live,
      imageProps: {
        width: 600,
        height: 400,
        objectFit: 'cover'
      }
    },
    {
      title: "Assignments",
      icon: <Assignment fontSize="large" color="primary" />,
      description: "Create, distribute, and grade assignments with automatic plagiarism detection.",
      image: ass,
      imageProps: {
        width: 600,
        height: 400,
        objectFit: 'cover'
      }
    },
    {
      title: "Quizzes",
      icon: <QuestionAnswer fontSize="large" color="primary" />,
      description: "Design interactive quizzes with various question types and automatic grading.",
      image: qui,
      imageProps: {
        width: 600,
        height: 400,
        objectFit: 'cover'
      }
    },
    {
      title: "Announcements",
      icon: <Announcement fontSize="large" color="primary" />,
      description: "Keep everyone informed with targeted announcements and notifications.",
      image: ann,
      imageProps: {
        width: 600,
        height: 400,
        objectFit: 'cover'
      }
    },
  ]
  return (
    <Box
      id="demo"
      ref={demoRef}
      sx={{
        py: 10,
        backgroundColor: "#f8f9fa",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          left: "-5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(63, 81, 181, 0.05) 0%, rgba(0, 188, 212, 0.05) 100%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(245, 0, 87, 0.05) 0%, rgba(255, 64, 129, 0.05) 100%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "70px",
                height: "4px",
                background: "linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)",
                borderRadius: "2px",
              },
            }}
          >
            See It In Action
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mt: 4,
              mb: 2,
              color: "text.secondary",
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Explore the key features of SmartClass platform
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            borderRadius: "20px",
            overflow: "hidden",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                py: 2,
              },
            }}
          >
            {demoContent.map((item, index) => (
              <Tab
                key={index}
                icon={item.icon}
                label={item.title}
                sx={{
                  fontWeight: 600,
                  "&.Mui-selected": {
                    color: "primary.main",
                  },
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                  {demoContent[activeTab].title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: "text.secondary", lineHeight: 1.8 }}>
                  {demoContent[activeTab].description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    borderRadius: "30px",
                  }}
                >
                  Try It Now
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
              <Box
      component="img"
      src={demoContent[activeTab].image}
      alt={demoContent[activeTab].title}
      sx={{
        width: "100%",
        height: "300px",  // Fixed height
        objectFit: "cover", // Ensure image covers entire area
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
      }}
    />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default LiveDemo

