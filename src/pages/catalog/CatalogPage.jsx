import { useState } from "react";
import { products, categories } from "../../data/Products";
import Header from "../../components/ui/Layout/Header"
import Footer from "../../components/ui/Layout/Footer";
import CategorySidebar from "../../components/features/Catalog/CategorySidebar";
import ProductGrid from "../../components/features/Catalog/ProductGrid";
import Pagination from "../../components/features/Catalog/Pagination";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import ChatWidget from "../../components/features/chat/ChatWidget";
import "./CatalogPage.css";

const CatalogPage = () => {
  // Semua state dan logika tetap di sini
  const [activeCategory, setActiveCategory] = useState("BUAH");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const itemsPerPage = 12;

  const getFilteredProducts = () => {
    // ...logika filter dan sortir tetap sama...
    let filtered = products[activeCategory] || [];
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        default: return a.name.localeCompare(b.name);
      }
    });
    return filtered;
  };

  const getCurrentPageProducts = () => {
    const filtered = getFilteredProducts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredProducts().length / itemsPerPage);
  };
  
  const getCategoryTitle = () => {
    const category = categories.find(cat => cat.id === activeCategory);
    return category ? category.name : "Produk";
  };


  return (
    <div className="catalog-page">
      <Header />
      <StepNavigation currentStep={1} />
      <main className="catalog-main">
        <div className="container">
          <div className="catalog-content">
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={(category) => {
                setActiveCategory(category);
                setCurrentPage(1); // Reset ke halaman 1 setiap ganti kategori
              }}
            />
            <div className="products-area">
              <div className="products-header">
                <div className="products-title-section">
                  <h1 className="products-title">{getCategoryTitle()}</h1>
                  <p className="products-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  </p>
                </div>
                <div className="products-controls">
                  <div className="search-box">
                    <input type="text" placeholder="Cari produk di sini..." />
                    <button className="search-btn">🔍</button>
                  </div>
                  <div className="sort-controls">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                      <option value="name">Urutkan</option>
                      <option value="price-low">Harga: Rendah ke Tinggi</option>
                      <option value="price-high">Harga: Tinggi ke Rendah</option>
                    </select>
                  </div>
                </div>
              </div>

              <ProductGrid products={getCurrentPageProducts()} />
              
              <Pagination
                currentPage={currentPage}
                totalPages={getTotalPages()}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default CatalogPage;