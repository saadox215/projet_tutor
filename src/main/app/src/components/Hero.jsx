"use client";

import { useState, useEffect } from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";
import { ArrowForward, School, Book, Assignment, LiveTv } from "@mui/icons-material";
import RotatingText from "./RotatingText";
import hero from "../assets/hero.jpg";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box
      id="home"
      sx={{
        background: "linear-gradient(135deg, #3f51b5 0%, #00bcd4 100%)",
        color: "white",
        pt: { xs: 15, md: 20 },
        pb: { xs: 10, md: 15 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float 15s infinite ease-in-out",
          "@keyframes float": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(30px, -30px) scale(1.1)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float2 18s infinite ease-in-out",
          "@keyframes float2": {
            "0%, 100%": { transform: "translate(0, 0) scale(1)" },
            "50%": { transform: "translate(-20px, 20px) scale(1.05)" },
          },
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            }}
          >
            {/* Main heading with RotatingText */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.2,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              Transforming{" "}
              <RotatingText
                  texts={["Education", "Learning", "Teaching"]}
                  mainClassName="bg-transparent text-white overflow-hidden py-0.5 rounded-lg"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              {" "}at ENSA Khouribga
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              A modern platform connecting professors and students for seamless learning experiences
            </Typography>
            
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 10px 20px rgba(245, 0, 87, 0.3)",
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    borderColor: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "opacity 0.8s ease-out 0.3s, transform 0.8s ease-out 0.3s",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: { xs: "300px", md: "400px" },
                width: "100%",
              }}
            >
              <Box
                component="img"
                src={hero}
                alt="SmartClass Platform"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "10px",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                  animation: "pulse 3s infinite ease-in-out",
                  "@keyframes pulse": {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.02)" },
                  },
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: "-10%",
                  left: "-5%",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  animation: "float3 5s infinite ease-in-out",
                  "@keyframes float3": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-15px)" },
                  },
                }}
              >
                <School color="primary" fontSize="large" />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: "20%",
                  right: "-5%",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  animation: "float4 6s infinite ease-in-out",
                  "@keyframes float4": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                  },
                }}
              >
                <Book color="secondary" fontSize="large" />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  left: "10%",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  animation: "float5 7s infinite ease-in-out",
                  "@keyframes float5": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-25px)" },
                  },
                }}
              >
                <Assignment color="primary" fontSize="large" />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "20%",
                  right: "10%",
                  backgroundColor: "white",
                  borderRadius: "50%",
                  p: 2,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  animation: "float6 8s infinite ease-in-out",
                  "@keyframes float6": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-15px)" },
                  },
                }}
              >
                <LiveTv color="secondary" fontSize="large" />
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Stats section without RotatingText */}
        <Grid
          container
          spacing={3}
          sx={{
            mt: 8,
            p: 3,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "15px",
            backdropFilter: "blur(10px)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(50px)",
            transition: "opacity 0.8s ease-out 0.6s, transform 0.8s ease-out 0.6s",
          }}
        >
          {[
            { value: "1000+", label: "Students" },
            { value: "50+", label: "Professors" },
            { value: "200+", label: "Courses" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <Grid item xs={6} sm={3} key={index} sx={{ textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {stat.label}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Wave divider */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{
            position: "relative",
            display: "block",
            width: "calc(100% + 1.3px)",
            height: "70px",
          }}
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="#FFFFFF"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="#FFFFFF"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </Box>
    </Box>
  );
};

export default Hero;