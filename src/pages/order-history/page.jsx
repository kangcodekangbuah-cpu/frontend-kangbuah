"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomerHeader from "../CustomerHeader";
import "./order-history.css";

const statusLabels = {
  MENUNGGU_PERSETUJUAN: "Menunggu Persetujuan",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  SEDANG_DIPROSES: "Sedang Diproses",
  DALAM_PENGIRIMAN: "Dalam Pengiriman",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

const statusColors = {
  MENUNGGU_PERSETUJUAN: "#FFA500",
  MENUNGGU_PEMBAYARAN: "#FF6B6B",
  SEDANG_DIPROSES: "#4ECDC4",
  DALAM_PENGIRIMAN: "#45B7D1",
  SELESAI: "#2ECC71",
  DIBATALKAN: "#95A5A6",
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true)


  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      setIsLoggedIn(false)
      navigate("/");
      return;
    }
    if (role === "ADMIN") {
      navigate("/admin/orders");
      return;
    }
  }, [navigate]);

  // Load orders dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("orders") || "[]";
    try {
      setOrders(JSON.parse(stored));
    } catch {
      setOrders([]);
    }
  }, []);

  return (
    <div className="order-history-page">
        <CustomerHeader isLoggedIn={isLoggedIn} />
      <header className="order-history-header">
        <div className="container">
          <h1>Riwayat Pesanan</h1>
        </div>
      </header>

      <main className="order-history-main">
        <div className="container order-history-grid">
          {/* Kiri: Daftar Pesanan */}
          <section className="orders-list">
            {orders.length === 0 ? (
              <div className="empty-state">
                <p>Anda belum memiliki pesanan.</p>
                <Link to="/catalog" className="btn-primary">
                  Mulai Berbelanja
                </Link>
              </div>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className={`order-item ${selectedOrder?.id === order.id ? "active" : ""}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-item-header">
                      <div className="order-id">Pesanan #{order.id}</div>
                      <div
                        className="status-badge"
                        style={{ backgroundColor: statusColors[order.status] }}
                      >
                        {statusLabels[order.status]}
                      </div>
                    </div>
                    <div className="order-item-date">
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </div>
                    <div className="order-item-total">
                      Rp {order.total.toLocaleString("id-ID")}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Kanan: Detail Pesanan */}
          <aside className="order-details">
            {selectedOrder ? (
              <>
                <h2>Detail Pesanan</h2>

                <div className="detail-section">
                  <h3>Status Pesanan</h3>
                  <div
                    className="status-badge large"
                    style={{ backgroundColor: statusColors[selectedOrder.status] }}
                  >
                    {statusLabels[selectedOrder.status]}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Informasi Pengiriman</h3>
                  <p>
                    <strong>
                      {selectedOrder.firstName} {selectedOrder.lastName}
                    </strong>
                  </p>
                  <p>{selectedOrder.address}</p>
                  <p>
                    {selectedOrder.city}, {selectedOrder.province}{" "}
                    {selectedOrder.postalCode}
                  </p>
                  <p>Telepon: {selectedOrder.phone}</p>
                </div>

                <div className="detail-section">
                  <h3>Item Pesanan</h3>
                  <ul className="items-list">
                    {selectedOrder.items.map((item) => (
                      <li key={item.id} className="item-row">
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-qty">
                            Qty: {item.qty || 1}
                          </div>
                        </div>
                        <div className="item-price">
                          Rp{" "}
                          {(item.price * (item.qty || 1)).toLocaleString(
                            "id-ID"
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Ringkasan Pembayaran</h3>
                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>
                        Rp {selectedOrder.subtotal.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Diskon</span>
                      <span>
                        - Rp {selectedOrder.discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Biaya Pengiriman</span>
                      <span>
                        Rp {selectedOrder.shipping.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="summary-row total">
                      <strong>Total</strong>
                      <strong>
                        Rp {selectedOrder.total.toLocaleString("id-ID")}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Metode Pembayaran</h3>
                  <p>
                    {selectedOrder.paymentMethod === "transfer"
                      ? "Transfer Bank"
                      : "QRIS"}
                  </p>
                </div>
              </>
            ) : (
              <div className="empty-details">
                <p>Pilih pesanan untuk melihat detail</p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
