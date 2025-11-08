import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import apiClient from "../../../services/api";
import ProductCard from "../../ui/Product/ProductCard";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await apiClient.get("/products?limit=8");
        
        setFeaturedItems(response.data.data.data);
      } catch (err) {
        console.error("Gagal mengambil produk unggulan:", err);
        setError("Tidak dapat memuat produk saat ini.");
      } finally {
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