import { formatPrice } from "../../../utils/formatPrice"; // Impor fungsi formatPrice
import defaultImage from "../../../assets/kiwi.jpg";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart }) => { // ✅ tambahkan onAddToCart
  const imageUrl =
    product.image_url &&
    Array.isArray(product.image_url) &&
    product.image_url.length > 0
      ? product.image_url[0]
      : defaultImage;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="product-price-section">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-unit">/{product.unit}</span>
        </div>

        <div className="product-stock">
          <span>Stok: {product.stock ?? 0}</span>
        </div>

        <button className="product-detail-btn">Detail</button>

        {/* ✅ pastikan handler aman dipanggil */}
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
