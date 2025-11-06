import ProductCard from "../../ui/Product/ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products, onAddToCart, onRemoveFromCart, onUpdateQuantity, cart }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Tidak ada produk tersedia.</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => {
        const cartItem = cart.find((item) => item.uniqueId === product.uniqueId);
        const isInCart = !!cartItem;

        return (
          <ProductCard
            key={product.uniqueId}
            product={product}
            onAddToCart={() => onAddToCart(product)}
            onRemoveFromCart={() => onRemoveFromCart(product)}
            onUpdateQuantity={onUpdateQuantity}
            isInCart={isInCart}
            cartItem={cartItem} 
          />
        );
      })}
    </div>
  );
};

export default ProductGrid;
