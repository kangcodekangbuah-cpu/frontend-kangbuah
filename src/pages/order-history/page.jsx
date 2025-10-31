"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import CustomerHeader from "../CustomerHeader";
import "./order-history.css";

const API_URL = "http://localhost:3000";

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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userId;

    if (token) {
      const decoded = jwtDecode(token);
      userId = decoded?.sub || decoded?.id || decoded?.userId;
    } else {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/history/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched orders:", res.data);

        setOrders(res.data.data || res.data.orders || []);
      } catch (err) {
        console.error("Gagal mengambil data pesanan:", err);
        toast.error("Gagal memuat riwayat pesanan.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Memuat data pesanan...</div>;
  }

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
                    key={order.order_id || order.id}
                    className={`order-item ${selectedOrder?.order_id === order.order_id ? "active" : ""
                      }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-item-header">
                      <div className="order-id">
                        Pesanan #{order.order_id || order.id}
                      </div>
                      <div
                        className="status-badge"
                        style={{
                          backgroundColor: statusColors[order.status],
                        }}
                      >
                        {statusLabels[order.status] || order.status}
                      </div>
                    </div>
                    <div className="order-item-date">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </div>
                    <div className="order-item-total">
                      Rp {Number(order.total_price)?.toLocaleString("id-ID")}
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
                    style={{
                      backgroundColor: statusColors[selectedOrder.status],
                    }}
                  >
                    {statusLabels[selectedOrder.status]}
                  </div>

                  {selectedOrder.status === "MENUNGGU_PEMBAYARAN" && (
                    <>
                      {!selectedOrder.attachment_url ? (
                        // kalau belum upload bukti
                        <button
                          className="btn-primary bayar-btn"
                          style={{ marginTop: "0.9rem" }}
                          onClick={() => navigate(`/payment/${selectedOrder.order_id}`)}
                        >
                          Bayar
                        </button>
                      ) : (
                        // Sudah upload bukti
                        <div
                          className="bukti-section"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginTop: "2rem",
                            justifyContent: "space-between",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <img
                              src={selectedOrder.attachment_url}
                              alt="Bukti pembayaran"
                              className="bukti-preview"
                              onClick={() => window.open(selectedOrder.attachment_url, "_blank")}
                            />
                            <a
                              href={selectedOrder.attachment_url}
                              target="_blank"
                              className="a"
                              rel="noopener noreferrer"
                              style={{ display: "block", marginTop: "6px", color: "#3498db" }}
                            >
                              Tinjau Bukti Pembayaran
                            </a>
                          </div>

                          <button
                            className="btn-upload-ulang"
                            onClick={() => navigate(`/payment/${selectedOrder.order_id}`)}
                          >
                            Upload Ulang
                          </button>
                        </div>
                      )}
                    </>
                  )}

                </div>

                <div className="detail-section">
                  <h3>Informasi Pengiriman</h3>
                  <p>
                    <strong>
                      {selectedOrder.delivery_address
                        ? `${selectedOrder.delivery_address.street}, ${selectedOrder.delivery_address.city}`
                        : "Alamat tidak ditemukan"}
                    </strong>
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Item Pesanan</h3>
                  <ul className="items-list">
                    {selectedOrder.order_details?.map((detail, i) => (
                      <li key={i} className="item-row">
                        <div className="item-info">
                          {detail.product?.image_url && (
                            <img
                              src={detail.product.image_url[0]}
                              alt={detail.product.name}
                              className="item-image"
                            />
                          )}
                          <div className="item-name">{detail.product?.name || "Produk"}</div>
                          <div className="item-qty">Qty: {detail.quantity}</div>
                        </div>
                        <div className="item-price">
                          Rp{" "}
                          {(detail.product?.price * detail.quantity).toLocaleString("id-ID")}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Ringkasan Pembayaran</h3>
                  <div className="payment-summary">
                    <div className="summary-row total">
                      <strong>Total</strong>
                      <strong>
                        Rp {parseFloat(selectedOrder.total_price)?.toLocaleString("id-ID")}
                      </strong>
                    </div>
                  </div>
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
