import { formatPrice } from "../../../utils/formatPrice"; // Impor fungsi formatPrice
import defaultImage from "../../../assets/kiwi.jpg";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, showAddtoCart = true }) => {
  const imageUrl =
    product.image_url &&
      Array.isArray(product.image_url) &&
      product.image_url.length > 0
      ? product.image_url[0]
      : defaultImage;

  const hasStock = (product.stock ?? 0) > 0;
  const stockText = hasStock ? `Persediaan : ${product.stock}` : 'Persediaan Habis'
  const stockClass = hasStock ? 'stockIn' : 'stockOut'

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
          <span className={`stock-badge ${stockClass}`}>{stockText}</span>
        </div>

        <button className="product-detail-btn">Detail</button>

        { showAddtoCart && (
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product)}
          disabled={!hasStock}
        >
          Tambah ke Keranjang
        </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
