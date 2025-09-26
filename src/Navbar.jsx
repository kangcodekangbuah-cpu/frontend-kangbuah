import { Link } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">ANS</span>
        </div>
        <div className="nav-menu">
          <a href="#home" className="nav-link">
            Beranda
          </a>
          <a href="#about" className="nav-link">
            Tentang
          </a>
          <a href="#vision" className="nav-link">
            Visi & Misi
          </a>
          <a href="#values" className="nav-link">
            Nilai
          </a>
          <Link to="/catalog" className="nav-link">
            Katalog
          </Link>
          <a href="#contact" className="nav-link">
            Kontak
          </a>
        </div>
        <div className="nav-buttons">
          <Link to="/login" className="btn-login">
            Login
          </Link>
          <Link to="/signup" className="btn-signup">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
