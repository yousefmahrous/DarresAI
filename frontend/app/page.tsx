import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import SubjectsSection from "../components/SubjectsSection";
import FeaturesSection from "../components/FeaturesSection";
import AboutSection from "../components/AboutSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SubjectsSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </>
  );
}