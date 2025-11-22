import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import { useModalStore } from "../store/useModalStore";

const CustomerHeader = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const { openModal, setLoading } = useModalStore.getState();

  const handleLogout = async () => {
    const confirmAction = async () => {
      setLoading(true);
      try {
        await logout();
        toast.success("Logout berhasil");
        useModalStore.getState().closeModal();
        setTimeout(() => {
          navigate("/");
        }, 500);
      } catch (error) {
        console.error("Gagal logout:", error);
        setLoading(false);
      }
    };

    openModal({
      title: "Konfirmasi Logout",
      message: "Keluar dari Akun ini?",
      onConfirm: confirmAction,
      confirmText: "Ya, Keluar",
      confirmVariant: "danger"
    })
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
