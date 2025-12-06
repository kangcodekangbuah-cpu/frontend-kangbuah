import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";
import { useModalStore } from "../../../store/useModalStore";
import { Menu, X } from "lucide-react";
import "./AdminHeader.css";

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { openModal, setLoading } = useModalStore.getState();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    handleLinkClick();
    
    openModal({
        title: "Konfirmasi Logout",
        message: "Keluar dari Akun Admin?",
        onConfirm: async () => {
            setLoading(true);
            try {
                await logout();
                toast.success("Logout berhasil");
                useModalStore.getState().closeModal();
                navigate("/", { replace: true });
            } catch (error) {
                console.error("Gagal logout:", error);
                setLoading(false);
            }
        },
        confirmText: "Ya, Keluar",
        confirmVariant: "danger"
    });
  };

  return (
    <nav className="admin-header">
      <div className="admin-nav-container">

        {/* --- LOGO (KIRI) --- */}
        <div className="admin-nav-logo">
          <Link to="/" onClick={handleLinkClick} className="logo-ans">
            ANS
          </Link>
        </div>

        {/* --- DESKTOP LINKS (KANAN) --- */}
        <div className="admin-nav-links-desktop">
          <NavLink to="/admin/catalog" className="admin-nav-link">Katalog</NavLink>
          <NavLink to="/admin/chat" className="admin-nav-link">Chat</NavLink>
          <NavLink to="/admin/orders" className="admin-nav-link">Pemesanan</NavLink>
          <NavLink to="/admin/analytics" className="admin-nav-link">Analytics</NavLink>
          <button className="admin-logout-btn" onClick={handleLogoutClick}>
            Logout
          </button>
        </div>

        {/* --- MOBILE: HAMBURGER BUTTON --- */}
        <div className="admin-nav-hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* --- MOBILE OVERLAY MENU --- */}
      <div className={`admin-mobile-menu ${isMenuOpen ? "active" : ""}`}>
          <NavLink to="/admin/catalog" className="admin-mobile-link" onClick={handleLinkClick}>Katalog</NavLink>
          <NavLink to="/admin/chat" className="admin-mobile-link" onClick={handleLinkClick}>Chat</NavLink>
          <NavLink to="/admin/orders" className="admin-mobile-link" onClick={handleLinkClick}>Pemesanan</NavLink>
          <NavLink to="/admin/analytics" className="admin-mobile-link" onClick={handleLinkClick}>Analytics</NavLink>
          
          <button className="admin-mobile-link mobile-logout-btn" onClick={handleLogoutClick}>
             Logout
          </button>
      </div>
    </nav>
  );
}