import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuthStore } from "../../../store/authStore";
import LogoANS from "../../../assets/KangCode_Kang_Buah__1_-removebg-preview.png";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = useAuthStore((state) => state.user?.role) || localStorage.getItem('role');

  const handleLogoutClick = () => {
    onLogout();
    handleLinkClick();
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-links-left">
          <a href="#home" className="nav-link">Beranda</a>
          <a href="#about" className="nav-link">Layanan</a>
        </div>

        <div className="nav-logo">
          <Link to="/" onClick={handleLinkClick}>
            <img src={LogoANS} alt="ANS Logo" className="logo-img" />
          </Link>
        </div>

        <div className="nav-links-right">
          <a href="#vision" className="nav-link">Visi & Misi</a>
          <a href="#contact" className="nav-link">Kontak</a>
        </div>
      </div>
    </nav>
  );
}
