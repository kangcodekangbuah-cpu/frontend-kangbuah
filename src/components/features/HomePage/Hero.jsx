import "./Hero.css";
import { useNavigate } from "react-router-dom";
import splashFruits from "../../../assets/splash-fruits.png"; // pastikan path benar

export default function Hero() {
    const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        {/* LOGIN BUTTON TOP RIGHT */}
        <div className="hero-login">
          <span>Sudah punya akun?</span>
          <button className="btn-login" onClick={handleLoginClick}>Login Disini!</button>
        </div>

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
            <a href="#consult" className="btn-consult" onClick={handleLoginClick}>Konsultasi Sekarang →</a>
            <a href="#daftar" className="btn-register" onClick={handleRegisterClick}>Daftar</a>
          </div>
        </div>
      </div>
    </section>
  );
}
