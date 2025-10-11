import './CategorySidebar.css';

const CategorySidebar = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <aside className="catalog-sidebar">
      <div className="sidebar-section">
        <h3>Kategori</h3>
        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-item ${activeCategory === category.id ? "active" : ""}`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="category-name">{category.name}</span>
              <span className="category-count">({category.count})</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;