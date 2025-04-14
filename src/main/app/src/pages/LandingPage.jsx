"use client"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar.jsx"
import Hero from "../components/Hero.jsx"
import Features from "../components/Features.jsx"
import About from "../components/About.jsx"
import Testimonials from "../components/Testimonials.jsx"
import Footer from "../components/Footer.jsx"
import LiveDemo from "../components/LiveDemo.jsx"
import ScrollToTop from "../components/ScrollToTop.jsx"
import { useState, useEffect } from "react"

const LandingPage = ({ user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`)
    }
  }, [user, navigate])

  return (
    <>
      <Navbar scrolled={scrolled} user={user} onLogout={onLogout} />
      <main>
        <Hero />
        <Features />
        <About />
        <LiveDemo />
        <Testimonials />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default LandingPage

