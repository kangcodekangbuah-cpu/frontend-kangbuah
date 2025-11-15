// CatalogPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHeader from "../CustomerHeader";
import Footer from "../../components/ui/Layout/Footer";
import CategorySidebar from "../../components/features/Catalog/CategorySidebar";
import ProductGrid from "../../components/features/Catalog/ProductGrid";
import Pagination from "../../components/features/Catalog/Pagination";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import ChatWidget from "../../components/features/chat/ChatWidget";
import "./CatalogPage.css";
import apiClient from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/ui/Layout/LoadingSpinner";

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
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const itemsPerPage = 12;
    const { isLoggedIn } = useAuthStore((state) => !!state.user);

    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            try {
                setCart(JSON.parse(stored));
            } catch {
                setCart([]);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const [sortField, sortOrder] = sortBy.split("-");
                const params = new URLSearchParams({
                    page: currentPage,
                    limit: itemsPerPage,
                    sortBy: sortField,
                    order: sortOrder.toUpperCase(),
                });

                if (activeCategory !== "ALL") params.append("type", activeCategory);
                if (searchQuery) params.append("search", searchQuery);

                const res = await apiClient.get(`/products?${params.toString()}`);

                const productData = res.data?.data?.data || [];
                const page = res.data?.data?.page || 1;
                const maxPage = res.data?.data?.max_page || 1;
                const dataWithUniqueId = productData.map((p) => ({
                    ...p,
                    uniqueId: `${p.type || "ALL"}-${p.product_id}`,
                }));

                setProducts(dataWithUniqueId);
                setPagination({ page, max_page: maxPage });
            } catch (error) {
                toast.error("Gagal memuat produk. Coba muat ulang halaman.");
            } finally {
                setIsLoading(false);
            }
        };

        const delay = setTimeout(fetchProducts, 300);
        return () => clearTimeout(delay);
    }, [currentPage, activeCategory, sortBy, searchQuery]);

    const addToCart = (product) => {
        setCart((prev) => {
            const idx = prev.findIndex((p) => p.uniqueId === product.uniqueId);
            if (idx > -1) {
                const copy = [...prev];
                copy[idx] = { ...copy[idx], qty: (copy[idx].qty || 1) + 1 };
                return copy;
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const removeFromCart = (product) => {
        setCart((prev) => prev.filter((p) => p.uniqueId !== product.uniqueId));
    };
    
const updateQuantity = (uniqueId, change) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, qty: Math.max(1, (item.qty || 1) + change) }
          : item
      )
      .filter((item) => item.qty > 0)
  );
};



    const goToOrderPage = () => {
        if (cart.length === 0) return toast.error("Keranjang masih kosong!");
        navigate("/order");
    };

    const getCategoryTitle = () => {
        const category = categories.find((cat) => cat.id === activeCategory);
        return category ? category.name : "Produk";
    };

    if (isLoading && products.length === 0) {
        return (
            <>
                <CustomerHeader />
                <StepNavigation currentStep={1} />
                <LoadingSpinner text="Memuat Data..." />

            </>
        )
    }

    return (
        <div className="catalog-page">
            <CustomerHeader />
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
                                    <p className="products-description">
                                        Jelajahi berbagai pilihan buah dan sayuran segar kami.
                                    </p>
                                </div>

                                <div className="products-controls">
                                    <div className="search-box">
                                        <input
                                            type="text"
                                            placeholder="Cari produk di sini..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        />
                                        <button className="search-btn">🔍</button>
                                    </div>

                                    <div className="sort-controls">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => {
                                                setSortBy(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="sort-select"
                                        >
                                            <option value="name-asc">Nama: A-Z</option>
                                            <option value="name-desc">Nama: Z-A</option>
                                            <option value="price-asc">
                                                Harga: Rendah ke Tinggi
                                            </option>
                                            <option value="price-desc">
                                                Harga: Tinggi ke Rendah
                                            </option>
                                        </select>
                                    </div>

                                    <button
                                        className={`start-order-btn ${cart.length === 0 ? "disabled" : ""
                                            }`}
                                        onClick={goToOrderPage}
                                        title={
                                            cart.length === 0
                                                ? "Keranjang kosong"
                                                : "Lanjut ke pesanan"
                                        }
                                    >
                                        Mulai Memesan ({cart.length})
                                    </button>
                                </div>
                            </div>

                            {isLoading ? (
                                <LoadingSpinner text="Memuat..." />
                            ) : (
                                <ProductGrid
                                    products={products}
                                    onAddToCart={addToCart}
                                    onRemoveFromCart={removeFromCart}
                                    onUpdateQuantity={updateQuantity}
                                    cart={cart} />
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
            <ChatWidget />
        </div>
    );
};

export default CatalogPage;

