// Lokasi: src/components/features/HomePage/FeaturedProducts.jsx

import { Link } from "react-router-dom";
import { products } from "../../../data/Products"; // 1. Impor data terpusat
import ProductCard from "../../ui/ProductCard";    // 2. Impor ProductCard universal
import "./FeaturedProducts.css"; // Gunakan CSS yang sudah ada, tapi sesuaikan isinya

// 3. Pilih beberapa produk saja untuk ditampilkan
const featuredItems = [
  ...products.fruits.slice(0, 4), // Ambil 4 buah pertama
  ...products.vegetables.slice(0, 8), // Ambil 8 sayuran pertama
];

const FeaturedProducts = () => {
  return (
    <section className="featured-products-section">
      <div className="container">
        <div className="featured-header">
          <h2>Produk Unggulan Kami</h2>
          <p>Pilihan produk segar terbaik yang siap diantar ke tempat Anda.</p>
        </div>
        <div className="products-grid">
          {featuredItems.map((product) => (
            <ProductCard key={product.id} product={product} />
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