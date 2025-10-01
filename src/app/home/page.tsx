import React from "react";
import Hero from "./_components/Hero/Hero";
import Features from "./_components/Features/Features";
import About from "./_components/About/About";
import Services from "./_components/Services/Services";
import Testimonials from "./_components/Testimonials/Testimonials";
import Contact from "./_components/Contact/Contact";
import Footer from "./_components/Footer/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
