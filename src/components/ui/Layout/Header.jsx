import { useNavigate } from 'react-router-dom';
import './Header.css';

// Komponen ini menerima 'title' sebagai prop agar bisa digunakan kembali
// Contoh: <PageHeader title="Katalog Produk" /> atau <PageHeader title="Profil Saya" />
const Header = ({ title }) => {
  const navigate = useNavigate();

  // Fungsi untuk kembali ke halaman sebelumnya
  const handleBack = () => {
    navigate(-1);
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    // Di sini Anda akan menambahkan logika logout (misal: hapus token, dll)
    console.log("Pengguna logout");
    navigate('/login'); // Arahkan ke halaman login setelah logout
  };

  return (
    <header className="page-header">
      <div className="container header-container">
        <button onClick={handleBack} className="header-btn back-btn">
          <span>&#8592;</span> Kembali
        </button>
        <h1 className="header-title">{title}</h1>
        <button onClick={handleLogout} className="header-btn logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;