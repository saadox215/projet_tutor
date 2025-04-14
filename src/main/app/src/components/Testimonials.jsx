;("use client")

import { useState, useEffect, useRef } from "react"
import { Container, Typography, Box, Paper, Avatar, Rating } from "@mui/material"
import { FormatQuote } from "@mui/icons-material"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import saad from "../assets/saad.jpg"
import selma from "../assets/selma.jpg"
import mehdi from "../assets/mehdi.jpg"

const testimonials = [
  {
    id: 1,
    name: "Saad Afifi",
    role: "Membre du groupe",
    avatar: saad,
    rating: 5,
    text: "Notre groupe travaille en parfaite synergie, combinant nos compétences et notre passion pour réussir nos projets ensemble.",
  },
  {
    id: 2,
    name: "El Oukyl El Mehdi",
    role: "Membre du groupe",
    avatar: mehdi,
    rating: 5,
    text: "La collaboration et l'entraide sont nos points forts. Ensemble, nous relevons tous les défis avec détermination et créativité.",
  },
  {
    id: 3,
    name: "Ezzakouni Selma",
    role: "Membre du groupe",
    avatar: selma,
    rating: 5,
    text: "Chacun de nous apporte une perspective unique qui enrichit notre travail d'équipe et nous permet de progresser continuellement.",
  },
]

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false)
  const testimonialsRef = useRef(null)

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

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current)
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current)
      }
    }
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <Box
      ref={testimonialsRef}
      sx={{
        py: 10,
        backgroundColor: "white",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
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
            Notre Équipe
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
            Découvrez les membres de notre groupe
          </Typography>
        </Box>

        <Box
          sx={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
          }}
        >
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <Box key={testimonial.id} sx={{ p: 2 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: "15px",
                    height: "100%",
                    position: "relative",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <FormatQuote
                    sx={{
                      position: "absolute",
                      top: 20,
                      left: 20,
                      fontSize: "3rem",
                      color: "rgba(63, 81, 181, 0.1)",
                      transform: "rotate(180deg)",
                    }}
                  />
                  <Box sx={{ mb: 3, pt: 3 }}>
                    <Typography variant="body1" sx={{ fontStyle: "italic", lineHeight: 1.8, color: "text.secondary" }}>
                      "{testimonial.text}"
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{
                        width: 60,
                        height: 60,
                        border: "3px solid",
                        borderColor: "primary.main",
                      }}
                    />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly size="small" sx={{ mt: 0.5 }} />
                    </Box>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Slider>
        </Box>
      </Container>
    </Box>
  )
}

export default Testimonials