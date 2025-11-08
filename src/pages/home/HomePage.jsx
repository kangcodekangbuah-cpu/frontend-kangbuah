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
import { useEffect } from "react"
import { toast } from "react-toastify"
import { useAuthStore } from "../../store/authStore"

export default function HomePage() {
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const userRole = useAuthStore((state) => state.user?.role);
  const handleLogout = useAuthStore((state) => state.logout);

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} onLogout={() => {
        handleLogout();
        toast.success("Logout berhasil");
      }} />
      <Hero />
      <About />
      <VisionMission />
      <CompanyValues />
      <FeaturedProducts />
      <Services />
      <ClientExperience />
      <Advantages />
      <MarketSegments />
      {isLoggedIn && userRole !== 'ADMIN' && <ChatWidget />}
    </div>
  )
}
