import ProductCard from "../../ui/Product/ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products, onAddToCart, onRemoveFromCart, cart }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Tidak ada produk tersedia.</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        const isInCart = cart.some((item) => item.uniqueId === product.uniqueId);

        return (
          <ProductCard
            key={product.uniqueId}
            product={product}
            onAddToCart={() => onAddToCart(product)}
            onRemoveFromCart={() => onRemoveFromCart(product)}
            isInCart={isInCart}
          />
        );
      })}
    </div>
  )
};

export default ProductGrid;
