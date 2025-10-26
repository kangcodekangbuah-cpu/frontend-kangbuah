import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CustomerHeader = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    toast.success("Logout berhasil");
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <header className="admin-cat-header">
      <div className="maxw">
        <div className="hdr-row">
          <Link to="/" className="logo-ans">
            ANS
          </Link>
          <nav className="admin-nav">
            <NavLink to="/catalog" className="nav-item">
              Katalog
            </NavLink>
            <NavLink to="/order-history" className="nav-item">
              Pemesanan
            </NavLink>
          </nav>
          <div className="right">
            {isLoggedIn && (
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
