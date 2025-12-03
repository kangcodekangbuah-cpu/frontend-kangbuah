import { Link } from "react-router-dom";
import "./Footer.css";
import LogoANS from "../../../assets/KangCode_Kang_Buah__1_-removebg-preview.png";

const Footer = () => {
  return (
    <footer className="catalog-footer">
      <div className="container">

        <div className="footer-content">

          {/* Logo + Deskripsi */}
          <div className="footer-section">
            <div className="footer-logo">
              <Link to="/">
                <img src={LogoANS} alt="ANS Logo" className="logo-img" />
              </Link>
            </div>

            <p className="footer-description">
              CV Agro Niaga Sejahtera berkomitmen untuk menjadi mitra terbaik 
              dalam penyediaan bahan pangan segar yang tidak hanya menjawab kebutuhan, 
              tetapi juga memberikan nilai lebih bagi para mitra usaha.
              Kami percaya, keberhasilan pelanggan adalah cermin keberhasilan kami.
            </p>
          </div>

          {/* Kontak */}
          <div className="footer-section">
            <h4>Kontak</h4>
            <ul className="footer-links">

              <li className="contact-item">
                <svg 
                  width="20" 
                  height="20" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm6.12 7.94a2.625 2.625 0 1 0-5.251 0 2.625 2.625 0 0 0 5.251 0zM12 14c-2.475 0-4.5 2.025-4.5 4.5V19h9v-.5c0-2.475-2.025-4.5-4.5-4.5z" />
                </svg>
                <a href="https://www.instagram.com/kangbuahfresh" target="_blank" rel="noreferrer">
                  @kangbuahfresh
                </a>
              </li>

              <li className="contact-item">
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V21c0 .55-.45 1-1 1C10.3 22 2 13.7 2 3c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.24 1.02l-2.2 2.2z"/>
                </svg>
                <a href="https://wa.me/6281212599323" target="_blank" rel="noreferrer">
                  +62 812-1259-9323
                </a>
              </li>

            </ul>
          </div>

          {/* Lokasi */}
          <div className="footer-section">
            <h4>Lokasi</h4>
            <p className="footer-location">
              Pasar Induk Kramat Jati, Los D 160.
            </p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 CV Agro Niaga Sejahtera. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
