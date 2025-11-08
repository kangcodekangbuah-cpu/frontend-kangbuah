import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";

const CustomerHeader = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => !!state.user);

  const handleLogout = async () => {
    await logout();
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
