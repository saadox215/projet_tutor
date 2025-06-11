// "use client"

import { useState, useEffect, useRef } from "react"
import { Container, Grid, Typography, Box, Card, CardContent, CardMedia, IconButton } from "@mui/material"
import {
  Announcement,
  CloudUpload,
  Assignment,
  FindInPage,
  QuestionAnswer,
  Videocam,
  People,
  ArrowForward,
} from "@mui/icons-material"
import annonce from "../assets/annonce.jpg"
import course from "../assets/course.webp"
import assign from "../assets/assign.png"
import plagiat from "../assets/plagiat.png"
import quiz from "../assets/quiz.webp"
import live from "../assets/live.jpg"
import user from "../assets/user.png"

const features = [
  {
    title: "Announcements",
    description:
      "Professors can publish announcements visible to the entire class, keeping everyone informed about important updates.",
    icon: <Announcement fontSize="large" color="primary" />,
    image: annonce,
  },
  {
    title: "Course Materials",
    description: "Easy upload and download of course materials with organized file structure and search functionality.",
    icon: <CloudUpload fontSize="large" color="primary" />,
    image: course,
  },
  {
    title: "Assignments",
    description: "Create, submit, and grade assignments with automatic notifications and deadline reminders.",
    icon: <Assignment fontSize="large" color="primary" />,
    image: assign,
  },
  {
    title: "Plagiarism Detection",
    description:
      "Advanced algorithms to detect similarities between submitted assignments and prevent academic dishonesty.",
    icon: <FindInPage fontSize="large" color="primary" />,
    image: plagiat,
  },
  {
    title: "Quizzes & Evaluations",
    description: "Create and automatically grade quizzes with various question types and detailed analytics.",
    icon: <QuestionAnswer fontSize="large" color="primary" />,
    image: quiz,
  },
  {
    title: "Live Streaming",
    description: "Conduct live classes with real-time interaction, chat, and recording capabilities for later review.",
    icon: <Videocam fontSize="large" color="primary" />,
    image: live,
  },
]

const Features = () => {
  const [visibleItems, setVisibleItems] = useState([])
  const featuresRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const timer = setTimeout(() => {
            setVisibleItems(Array(features.length).fill(true))
          }, 100)
          return () => clearTimeout(timer)
        }
      },
      { threshold: 0.1 },
    )

    if (featuresRef.current) {
      observer.observe(featuresRef.current)
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current)
      }
    }
  }, [])

  return (
    <Box
      id="features"
      ref={featuresRef}
      sx={{
        py: 10,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
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
            Powerful Features
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
            Everything you need to enhance the educational experience
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={index}
              sx={{
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index] ? "translateY(0)" : "translateY(50px)",
                transition: `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`,
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
                  },
                  // Ajout d'une hauteur fixe pour toutes les cartes
                  
                }}
              >
                <CardMedia 
                  component="img" 
                  height="200" 
                  image={feature.image} 
                  alt={feature.title} 
                  sx={{
                    // Assurer que toutes les images ont la même taille
                    height: "200px",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    // Garantir que le contenu a une hauteur uniforme
                    height: "250px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ mr: 2 }}>{feature.icon}</Box>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        // Garantir que les descriptions ont la même hauteur
                        minHeight: "80px",
                        overflow: "hidden",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton color="primary" aria-label="learn more">
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Features