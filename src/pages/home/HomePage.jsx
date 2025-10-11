// HomePage.jsx
import Navbar from "/src/Navbar"
import Hero from "/src/Hero"
import About from "/src/About"
import VisionMission from "/src/VisionMission"
import CompanyValues from "/src/CompanyValues"
import Catalog from "/src/Catalog"
import Services from "/src/Services"
import ClientExperience from "/src/ClientExperience"
import Advantages from "/src/Advantages"
import MarketSegments from "/src/MarketSegments"

export default function HomePage() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <VisionMission />
      <CompanyValues />
      <Catalog />
      <Services />
      <ClientExperience />
      <Advantages />
      <MarketSegments />
    </div>
  )
}
