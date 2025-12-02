import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuthStore } from "../../../store/authStore";
import { Menu, X } from "lucide-react";
import LogoANS from "../../../assets/KangCode_Kang_Buah__1_-removebg-preview.png";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = useAuthStore((state) => state.user?.role) || localStorage.getItem('role');
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
          <a href="#service" className="nav-link">Layanan</a>
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

        {/* --- MOBILE: HAMBURGER BUTTON --- */}
        <div className="nav-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>
      {/* --- MOBILE OVERLAY MENU (Hanya muncul di HP/Tablet) --- */}
      <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
          <a href="#home" className="mobile-link" onClick={handleLinkClick}>Beranda</a>
          <a href="#about" className="mobile-link" onClick={handleLinkClick}>Layanan</a>
          <a href="#vision" className="mobile-link" onClick={handleLinkClick}>Visi & Misi</a>
          <a href="#contact" className="mobile-link" onClick={handleLinkClick}>Kontak</a>

          {isLoggedIn && (
             <button className="mobile-link" onClick={handleLogoutClick} style={{background:'none', border:'none', cursor:'pointer', color:'red'}}>
                Logout
             </button>
          )}
      </div>
    </nav>
  );
}
