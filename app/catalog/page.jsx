"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import StepNavigation from "../../src/StepNavigation"
import "./catalog.css"

const CatalogPage = () => {
  const [activeCategory, setActiveCategory] = useState("fruits")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("name")
  const [showChat, setShowChat] = useState(false)
  const itemsPerPage = 12
  const products = {
    vegetables: [
      { id: 1, name: "Wortel 1kg", image: "/fresh-carrots.png", price: 15000, unit: "1kg" },
      { id: 2, name: "Kentang 5kg", image: "/fresh-potatoes.png", price: 45000, unit: "5kg" },
      { id: 3, name: "Tomat 1kg", image: "/red-chili-peppers.jpg", price: 12000, unit: "1kg" },
      { id: 4, name: "Brokoli 1kg", image: "/fresh-broccoli.png", price: 25000, unit: "1kg" },
      { id: 5, name: "Cabe Merah Keriting", image: "/red-chili-peppers.jpg", price: 35000, unit: "1kg" },
      {
        id: 6,
        name: "Cabe Merah Besar",
        image: "/large-red-chili-peppers.jpg",
        price: 40000,
        unit: "1kg",
      },
      {
        id: 7,
        name: "Paprika Merah/Kuning",
        image: "/red-and-yellow-bell-peppers.jpg",
        price: 28000,
        unit: "1kg",
      },
      { id: 8, name: "Kol Putih", image: "/white-cabbage.jpg", price: 8000, unit: "1kg" },
      { id: 9, name: "Kembang Kol Impor", image: "/fresh-cauliflower.jpg", price: 22000, unit: "1kg" },
      {
        id: 10,
        name: "Jamur Champignon",
        image: "/white-button-mushrooms.png",
        price: 35000,
        unit: "500g",
      },
      { id: 11, name: "Wortel Baby", image: "/fresh-carrots.png", price: 18000, unit: "500g" },
      { id: 12, name: "Kentang Merah", image: "/fresh-potatoes.png", price: 20000, unit: "1kg" },
      { id: 13, name: "Brokoli Organik", image: "/fresh-broccoli.png", price: 35000, unit: "1kg" },
      {
        id: 14,
        name: "Cabe Rawit Hijau",
        image: "/small-red-chili-peppers.jpg",
        price: 45000,
        unit: "1kg",
      },
      {
        id: 15,
        name: "Paprika Hijau",
        image: "/red-and-yellow-bell-peppers.jpg",
        price: 25000,
        unit: "1kg",
      },
    ],
    fruits: [
      {
        id: 16,
        name: "Semangka Non Biji",
        image: "/seedless-watermelon.jpg",
        price: 25000,
        unit: "1 buah",
      },
      { id: 17, name: "Melon Sky Rocket", image: "/cantaloupe-melon.png", price: 35000, unit: "1 buah" },
      {
        id: 18,
        name: "Pepaya Kalifornia",
        image: "/california-papaya-fruit.jpg",
        price: 15000,
        unit: "1 buah",
      },
      { id: 19, name: "Nanas Sunpride", image: "/fresh-pineapple.jpg", price: 20000, unit: "1 buah" },
      { id: 20, name: "Pisang Sunpride", image: "/fresh-bananas.jpg", price: 18000, unit: "1 sisir" },
    ],
    special: [
      { id: 21, name: "Beras Premium", image: "/white-rice-grains.jpg", price: 85000, unit: "5kg" },
      { id: 22, name: "Minyak Goreng", image: "/cooking-oil-bottle.png", price: 45000, unit: "2L" },
      { id: 23, name: "Ayam Boiler", image: "/fresh-chicken.png", price: 35000, unit: "1kg" },
      { id: 24, name: "Telur Ayam Negeri", image: "/fresh-chicken-eggs.jpg", price: 28000, unit: "1kg" },
    ],
  }

  const categories = [
    { id: "fruits", name: "Buah-buahan", count: products.fruits.length },
    { id: "vegetables", name: "Sayuran", count: products.vegetables.length },
    { id: "special", name: "Permintaan Khusus", count: products.special.length },
  ]

  const getFilteredProducts = () => {
    let filtered = products[activeCategory] || []

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }

  const getCurrentPageProducts = () => {
    const filtered = getFilteredProducts()
    const startIndex = (currentPage - 1) * itemsPerPage
    return filtered.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = () => {
    return Math.ceil(getFilteredProducts().length / itemsPerPage)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getCategoryTitle = () => {
    switch (activeCategory) {
      case "fruits":
        return "Buah-buahan"
      case "vegetables":
        return "Sayuran"
      case "special":
        return "Permintaan Khusus"
      default:
        return "Produk"
    }
  }

  return (
    <div className="catalog-page">
      {/* Header */}
      <header className="catalog-header">
        <div className="container">
          <div className="header-content">
            <div className="nav-logo">
              <Link to="/" className="logo">
                <span className="logo-ans">ANS</span>
              </Link>
            </div>
            <nav className="header-nav">
              <Link to="/" className="nav-item">
                Beranda
              </Link>
              <Link to="#" className="nav-item">
                Tentang
              </Link>
              <Link to="#" className="nav-item">
                Visi & Misi
              </Link>
              <Link to="#" className="nav-item">
                Nilai
              </Link>
              <Link to="/catalog" className="nav-item active">
                Katalog
              </Link>
              <Link to="#" className="nav-item">
                Kontak
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <StepNavigation currentStep={1} />

      {/* Main Content */}
      <main className="catalog-main">
        <div className="container">
          <div className="catalog-content">
            {/* Sidebar */}
            <aside className="catalog-sidebar">
              <div className="sidebar-section">
                <h3>Kategori</h3>
                <div className="category-list">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`category-item ${activeCategory === category.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setCurrentPage(1)
                      }}
                    >
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Area */}
            <div className="products-area">
              {/* Products Header */}
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

                    <select className="filter-select">
                      <option>Filter</option>
                      <option>Stok Tersedia</option>
                      <option>Produk Baru</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="products-grid">
                {getCurrentPageProducts().map((product) => (
                  <div key={product.id} className="product-card">
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
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ←
                </button>

                {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="pagination-btn"
                  disabled={currentPage === getTotalPages()}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="catalog-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-ans">ANS</span>
              </div>
              <p className="footer-description">
                Menjaga Kualitas Buah Segar Berkualitas untuk Kebutuhan Pelanggan Setiap Hari
              </p>
            </div>

            <div className="footer-section">
              <h4>Produk</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Buah Segar Lokal</a>
                </li>
                <li>
                  <a href="#">Sayuran</a>
                </li>
                <li>
                  <a href="#">Layanan Konsultasi</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Perusahaan</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Tentang Kami</a>
                </li>
                <li>
                  <a href="#">Karir</a>
                </li>
                <li>
                  <a href="#">Kontak</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Dukungan</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Pusat Bantuan</a>
                </li>
                <li>
                  <a href="#">FAQ</a>
                </li>
                <li>
                  <a href="#">Syarat & Ketentuan</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 Kang Buah. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <div className="floating-chat">
        <button className="chat-toggle-btn" onClick={() => setShowChat(!showChat)}>
          💬
        </button>

        {showChat && (
          <div className="chat-popup">
            <div className="chat-header">
              <h4>Konsultasi</h4>
              <button className="chat-close-btn" onClick={() => setShowChat(false)}>
                ×
              </button>
            </div>
            <div className="chat-messages">
              <div className="message admin-message">
                <div className="message-content">
                  Halo! Selamat datang di CV Agro Niaga Sejahtera. Ada yang bisa kami bantu?
                </div>
                <div className="message-time">10:30</div>
              </div>
              <div className="message user-message">
                <div className="message-content">Saya ingin konsultasi tentang kebutuhan sayuran untuk restoran</div>
                <div className="message-time">10:32</div>
              </div>
              <div className="message admin-message">
                <div className="message-content">
                  Tentu! Kami siap membantu kebutuhan sayuran untuk restoran Anda. Berapa kapasitas yang dibutuhkan per
                  hari?
                </div>
                <div className="message-time">10:33</div>
              </div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Ketik pesan..." />
              <button className="send-btn">Kirim</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CatalogPage
