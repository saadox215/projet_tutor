import { Container, Grid, Typography, Box, Link, IconButton, Divider, Button, TextField } from "@mui/material"
import { Facebook, Twitter, LinkedIn, Instagram, Send, School } from "@mui/icons-material"

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#212529",
        color: "white",
        pt: 8,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <School sx={{ fontSize: 40, mr: 1, color: "#3f51b5" }} />
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                SmartClass
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.7, maxWidth: "300px" }}>
              Transforming education at ENSA Khouribga with a modern platform that connects professors and students for
              seamless learning experiences.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <Facebook />, label: "Facebook" },
                { icon: <Twitter />, label: "Twitter" },
                { icon: <LinkedIn />, label: "LinkedIn" },
                { icon: <Instagram />, label: "Instagram" },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  aria-label={social.label}
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "#3f51b5",
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {["Home", "Features", "About", "Demo", "Contact"].map((item, index) => (
                <Link
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  underline="none"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Features
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {["Announcements", "Course Materials", "Assignments", "Quizzes", "Live Classes", "User Management"].map(
                (item, index) => (
                  <Link
                    key={index}
                    href="#"
                    underline="none"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "white",
                      },
                    }}
                  >
                    {item}
                  </Link>
                ),
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
              Stay updated with the latest features and announcements.
            </Typography>
            <Box sx={{ display: "flex", mb: 3 }}>
              <TextField
                placeholder="Your email address"
                variant="outlined"
                size="small"
                fullWidth
                sx={{
                  mr: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                }}
              />
              <Button variant="contained" color="primary" sx={{ minWidth: "auto", borderRadius: "4px" }}>
                <Send />
              </Button>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Contact us:{" "}
              <Link href="mailto:info@smartclass.ensa.ma" underline="hover" sx={{ color: "white" }}>
                info@smartclass.ensa.ma
              </Link>
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "center" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} SmartClass. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, sm: 0 } }}>
            <Link href="#" underline="hover" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem" }}>
              Privacy Policy
            </Link>
            <Link href="#" underline="hover" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem" }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

