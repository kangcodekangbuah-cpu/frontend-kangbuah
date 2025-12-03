import { useState } from "react";
import { formatPrice } from "../../../utils/formatPrice";
import defaultImage from "../../../assets/placeHolder.png";
import "./ProductCard.css";

const ProductCard = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity, // tambahkan callback ini
  showAddtoCart = true,
  isInCart,
  cartItem // berisi data item di cart (termasuk qty)
}) => {
  const imageUrl =
    product.image_url &&
    Array.isArray(product.image_url) &&
    product.image_url.length > 0
      ? product.image_url[0]
      : defaultImage;

  const hasStock = (product.stock ?? 0) > 0;
  const stockText = hasStock ? `Persediaan : ${product.stock}` : "Persediaan Habis";
  const stockClass = hasStock ? "stockIn" : "stockOut";

  const qty = cartItem?.qty || 0;

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

        {/* <button className="product-detail-btn">Detail</button> */}

        {showAddtoCart && (
          <>
            {!isInCart ? (
              <button
                className="add-to-cart-btn"
                onClick={() => onAddToCart && onAddToCart(product)}
                disabled={!hasStock}
              >
                Tambah ke Keranjang
              </button>
            ) : (
              <div className="qty-control">
                {qty > 1 ? (
                  <button
                    className="del-btn"
                    onClick={() =>
                      onUpdateQuantity &&
                      onUpdateQuantity(product.uniqueId, -1)
                    }
                  >
                    -
                  </button>
                ) : (
                  <button
                    className="del-btn"
                    onClick={() => onRemoveFromCart && onRemoveFromCart(product)}
                  >
                    <svg
                      viewBox="0 0 448 512"
                      width="14"
                      height="14"
                      fill="currentColor"
                    >
                      <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                    </svg>
                  </button>
                )}

                <span className="qty-value">{qty}</span>

                <button
                  className="qty-btn"
                  onClick={() =>
                    onUpdateQuantity &&
                    onUpdateQuantity(product.uniqueId, 1)
                  }
                >
                  +
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
