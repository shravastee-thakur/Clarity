import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Plans from "./components/Plans";
import ClarityCTA from "./components/ClarityCTA";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Plans />
      <ClarityCTA />
      <Footer />
    </div>
  );
};

export default App;
