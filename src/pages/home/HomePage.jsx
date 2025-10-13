// HomePage.jsx
import Navbar from "../../components/ui/Layout/Navbar"
import Hero from "../../components/features/HomePage/Hero"
import About from "../../components/features/HomePage/About"
import VisionMission from "../../components/features/HomePage/VisionMission"
import CompanyValues from "../../components/features/HomePage/CompanyValues"
import FeaturedProducts from "../../components/features/HomePage/FeaturedProducts"
import Services from "../../components/features/HomePage/Services"
import ClientExperience from "../../components/features/HomePage/ClientExperience"
import Advantages from "../../components/features/HomePage/Advantages"
import MarketSegments from "../../components/features/HomePage/MarketSegments"
import ChatWidget from "../../components/features/chat/ChatWidget"

export default function HomePage() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <VisionMission />
      <CompanyValues />
      <FeaturedProducts />
      <Services />
      <ClientExperience />
      <Advantages />
      <MarketSegments />
      <ChatWidget />
    </div>
  )
}
