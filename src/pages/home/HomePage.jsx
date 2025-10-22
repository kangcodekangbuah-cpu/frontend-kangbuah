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
import { useState, useEffect } from "react"
import { toast } from "react-toastify"

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Cek status login saat komponen pertama kali dimuat
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role')
    if (token) {
      try {
        setIsLoggedIn(true);
        setUserRole(role);
      } catch (error) {
        console.error("Token tidak valid, melakukan logout:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, []);

  // --- Fungsi logout dipindahkan ke sini ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    toast.success("Logout berhasil");
  };

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Hero />
      <About />
      <VisionMission />
      <CompanyValues />
      <FeaturedProducts />
      <Services />
      <ClientExperience />
      <Advantages />
      <MarketSegments />
      {isLoggedIn && userRole !== 'ADMIN' && <ChatWidget isLoggedIn={isLoggedIn} />}
    </div>
  )
}
