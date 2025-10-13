import ProductCard from "../../ui/Product/ProductCard";
import './ProductGrid.css'

const ProductGrid = ({ products }) => {
  return (
    <div className="products-grid">
      {products.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;