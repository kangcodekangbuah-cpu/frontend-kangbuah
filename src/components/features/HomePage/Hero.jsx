import "./Hero.css";
import { useNavigate } from "react-router-dom";
import splashFruits from "../../../assets/splash-fruits.png";
import { useAuthStore } from "../../../store/authStore";
import { useModalStore } from "../../../store/useModalStore";
import { toast } from "react-toastify";

export default function Hero() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => !!state.user);
  const logout = useAuthStore((state) => state.logout);
  const { openModal, setLoading } = useModalStore.getState();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLogoutClick = () => {
    const confirmAction = async () => {
      setLoading(true);
      try {
        await logout();
        toast.success("Logout berhasil");
        useModalStore.getState().closeModal();
      } catch (error) {
        console.error("Gagal logout:", error);
        toast.error("Gagal logout");
      } finally {
        setLoading(false);
      }
    };

    openModal({
      title: "Konfirmasi Logout",
      message: "Apakah Anda yakin ingin keluar akun?",
      onConfirm: confirmAction,
      confirmText: "Ya, Keluar",
      confirmVariant: "danger"
    });
  };


  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        {/* LOGIN BUTTON TOP RIGHT */}
        {!isLoggedIn && (
          <div className="hero-login">
            <span>Sudah punya akun?</span>
            <button className="btn-login" onClick={handleLoginClick}>Login Disini!</button>
          </div>
        )}

        <div className="hero-image">
          <img src={splashFruits} alt="splash fruits" />
        </div>

        {/* LEFT TEXT BLOCK */}
        <div className="hero-left">
          <span className="hero-tagline">Segar Hari Ini, Sehat Setiap Hari</span>
          <h1 className="hero-title">Agro Niaga</h1>
          <p className="hero-desc">
            Kami menghadirkan buah-buahan pilihan langsung dari Pasar dan petani lokal
          </p>
        </div>

        {/* RIGHT TEXT BLOCK */}
        <div className="hero-right">
          <p className="hero-sub">
            Menyediakan kesegaran dari pasar ke meja anda
          </p>
          <h2 className="hero-title2">Sejahtera</h2>
          <div className="hero-buttons">
            {isLoggedIn ? (
              <button className="btn-logout-hero" onClick={handleLogoutClick}>
                Logout
              </button>
            ) : (
              <>
                <a href="#consult" className="btn-consult" onClick={(e) => {
                  e.preventDefault();
                  handleLoginClick();
                }}>
                  Konsultasi Sekarang →
                </a>
                <a href="#daftar" className="btn-register" onClick={(e) => {
                  e.preventDefault();
                  handleRegisterClick();
                }}>
                  Daftar
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};