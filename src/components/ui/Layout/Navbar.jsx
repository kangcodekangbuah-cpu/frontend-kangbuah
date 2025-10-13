import { useState, useEffect } from "react"; // 1. Impor useState
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "./Navbar.css";

export default function Navbar() {
  // 2. Buat state untuk mengontrol menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false); 
    handleLinkClick(); 
    toast.success("Logout berhasil")
  };

  // Fungsi untuk menutup menu saat link diklik
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" onClick={handleLinkClick}>
            <span className="logo-text">ANS</span>
          </Link>
        </div>

        {/* --- Menu untuk Desktop --- */}
        <div className="nav-menu-desktop">
          <a href="#home" className="nav-link">Beranda</a>
          <a href="#about" className="nav-link">Tentang</a>
          <a href="#vision" className="nav-link">Visi & Misi</a>
          <a href="#values" className="nav-link">Nilai</a>
          <a href="#contact" className="nav-link">Kontak</a>
        </div>
        <div className="nav-buttons-desktop">
          {isLoggedIn ? (
            <>
              <Link to={role === "ADMIN" ? "/admin/catalog" : "/catalog"} className="btn-login">Katalog</Link>
              <button onClick={handleLogout} className="btn-signup">Logout</button>
            </>
          ) : (
            <>
              <Link to="/catalog" className="btn-login">Katalog</Link>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        {/* --- Tombol Hamburger untuk Mobile --- */}
        <button className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`bar ${isMenuOpen ? "animate" : ""}`}></div>
          <div className={`bar ${isMenuOpen ? "animate" : ""}`}></div>
          <div className={`bar ${isMenuOpen ? "animate" : ""}`}></div>
        </button>
      </div>

      {/* --- Menu Mobile (muncul saat hamburger diklik) --- */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-buttons">
          {isLoggedIn ? (
            <>
              <Link to={role === "ADMIN" ? "/admin/catalog" : "/catalog"} className="btn-login" onClick={handleLinkClick}>Katalog</Link>
              <button onClick={handleLogout} className="btn-signup">Logout</button>
            </>
          ) : (
            <>
              <Link to="/catalog" className="btn-login" onClick={handleLinkClick}>Katalog</Link>
              <Link to="/login" className="btn-login" onClick={handleLinkClick}>Login</Link>
              <Link to="/register" className="btn-signup" onClick={handleLinkClick}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}