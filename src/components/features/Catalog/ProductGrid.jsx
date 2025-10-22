import ProductCard from "../../ui/Product/ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products, onAddToCart }) => {
  // Pastikan products adalah array
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Tidak ada produk tersedia.</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.uniqueId || product.id || product.product_id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
