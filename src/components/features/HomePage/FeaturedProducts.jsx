import { useState, useEffect } from "react"; // 1. Impor useState dan useEffect
import { Link } from "react-router-dom";
import axios from "axios"; // 2. Impor axios untuk request API
import ProductCard from "../../ui/Product/ProductCard";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  // 3. Buat state untuk menampung data, status loading, dan error
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. Gunakan useEffect untuk mengambil data dari API saat komponen dimuat
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Panggil endpoint produk Anda.
        // Menambahkan `?limit=8` adalah cara efisien untuk hanya mengambil 8 produk.
        const response = await axios.get("http://localhost:3000/products?limit=8");
        
        // Simpan data produk dari API ke dalam state
        setFeaturedItems(response.data.data.data);
      } catch (err) {
        // Jika terjadi error, simpan pesan error di state
        console.error("Gagal mengambil produk unggulan:", err);
        setError("Tidak dapat memuat produk saat ini.");
      } finally {
        // Hentikan status loading, baik berhasil maupun gagal
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); 

  if (loading) {
    return (
      <section className="featured-products-section">
        <div className="container">
          <div className="featured-header">
            <h2>Produk Unggulan Kami</h2>
          </div>
          <p>Memuat produk...</p>
        </div>
      </section>
    );
  }

  // Tampilan jika terjadi error
  if (error) {
    return (
      <section className="featured-products-section">
        <div className="container">
          <div className="featured-header">
            <h2>Produk Unggulan Kami</h2>
          </div>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </section>
    );
  }

  // Tampilan jika data berhasil dimuat
  return (
    <section className="featured-products-section">
      <div className="container">
        <div className="featured-header">
          <h2>Produk Unggulan Kami</h2>
          <p>Pilihan produk segar terbaik yang siap diantar ke tempat Anda.</p>
        </div>
        <div className="products-grid">
          {featuredItems.map((product) => (
            <ProductCard 
            key={product.product_id} 
            product={product}
            showAddtoCart={false} />
          ))}
        </div>
        <div className="featured-footer">
          <Link to="/catalog" className="btn-view-all">
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;