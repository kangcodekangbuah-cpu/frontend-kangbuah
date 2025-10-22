// CatalogPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/ui/Layout/Header";
import Footer from "../../components/ui/Layout/Footer";
import CategorySidebar from "../../components/features/Catalog/CategorySidebar";
import ProductGrid from "../../components/features/Catalog/ProductGrid";
import Pagination from "../../components/features/Catalog/Pagination";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import ChatWidget from "../../components/features/chat/ChatWidget";
import "./CatalogPage.css";

const categories = [
    { id: "ALL", name: "Semua Kategori" },
    { id: "BUAH", name: "Buah-buahan" },
    { id: "SAYUR", name: "Sayuran" },
    { id: "LAIN_LAIN", name: "Permintaan Khusus" },
];

const CatalogPage = () => {

    const [activeCategory, setActiveCategory] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("name-asc"); 
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, max_page: 1 });
    const [isLoading, setIsLoading] = useState(true);


    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Cek status login saat halaman dimuat
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const itemsPerPage = 12;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const [sortField, sortOrder] = sortBy.split('-');

                const params = new URLSearchParams({
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy: sortField,
                    order: sortOrder.toUpperCase(),
                });

                if (activeCategory !== "ALL") {
                    params.append('type', activeCategory);
                }
                if (searchQuery) {
                    params.append('search', searchQuery);
                }
                
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:3000/products?${params.toString()}`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                setProducts(res.data.data);
                setPagination({
                    page: res.data.page,
                    max_page: res.data.max_page,
                });

            } catch (error) {
                console.error("Gagal mengambil data produk:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const searchTimeout = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(searchTimeout);

    }, [currentPage, activeCategory, sortBy, searchQuery]); 
    
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
                                setCurrentPage(1); 
                            }}
                        />
                        <div className="products-area">
                            <div className="products-header">
                                <div className="products-title-section">
                                    <h1 className="products-title">{getCategoryTitle()}</h1>
                                    <p className="products-description">Jelajahi berbagai pilihan buah dan sayuran segar kami.</p>
                                </div>
                                <div className="products-controls">
                                    <div className="search-box">
                                        <input 
                                            type="text" 
                                            placeholder="Cari produk di sini..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <button className="search-btn">🔍</button>
                                    </div>
                                    <div className="sort-controls">
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                                            <option value="name-asc">Nama: A-Z</option>
                                            <option value="name-desc">Nama: Z-A</option>
                                            <option value="price-asc">Harga: Rendah ke Tinggi</option>
                                            <option value="price-desc">Harga: Tinggi ke Rendah</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <ProductGrid products={products} />
                            )}
                            
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.max_page}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ChatWidget isLoggedIn={isLoggedIn}/>
        </div>
    );
};

export default CatalogPage;