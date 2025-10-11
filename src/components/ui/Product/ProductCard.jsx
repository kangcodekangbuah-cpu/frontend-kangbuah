import { formatPrice } from "../../../utils"; // Impor fungsi formatPrice
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-section">
          <span className="product-price">{formatPrice(product.price)}</span>
          <span className="product-unit">/{product.unit}</span>
        </div>
        <button className="product-detail-btn">Detail</button>
      </div>
    </div>
  );
};

export default ProductCard;