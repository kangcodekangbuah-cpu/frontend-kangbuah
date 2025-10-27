import { useNavigate } from 'react-router-dom';
import './Header.css';

// Komponen ini menerima 'title' sebagai prop agar bisa digunakan kembali
// Contoh: <PageHeader title="Katalog Produk" /> atau <PageHeader title="Profil Saya" />
const Header = ({ title }) => {
  const navigate = useNavigate();

  // Fungsi untuk kembali ke halaman sebelumnya
  const handleBack = () => {
      navigate('/');
  };


  return (
    <header className="page-header">
      <div className="container header-container">
        <button onClick={handleBack} className="header-btn back-btn">
          <span>&#8592;</span> Kembali
        </button>
        <h1 className="header-title">{title}</h1>
      </div>
    </header>
  );
};

export default Header;