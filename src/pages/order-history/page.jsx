"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import CustomerHeader from "../CustomerHeader";
import "./order-history.css";
import apiClient from "../../services/api";
import { useAuthStore } from "../../store/authStore";

const statusLabels = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  SEDANG_DIPROSES: "Sedang Diproses",
  DALAM_PENGIRIMAN: "Dalam Pengiriman",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
};

const statusColors = {
  SEDANG_DIPROSES: "#FFA500",
  MENUNGGU_PEMBAYARAN: "#FF6B6B",
  MENUNGGU_VERIFIKASI: "#4ECDC4",
  DALAM_PENGIRIMAN: "#45B7D1",
  SELESAI: "#2ECC71",
  DIBATALKAN: "#95A5A6",
};

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.user?.sub);

  useEffect(() => {

    if (!userId) {
      toast.warning("Silahkan login terlebih dahulu!");

      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timer);
    }

    const fetchOrders = async () => {
      try {
        const res = await apiClient.get(`/orders/history/${userId}`);
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
  }, [navigate, userId]);

  if (loading) {
    return (
      <div>
        <main className="chat-main loading-container">
          <div className="spinner"></div>
          <p>Memuat Data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <CustomerHeader />

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
                    key={order.order_id}
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
                      {selectedOrder
                        ? `${selectedOrder.delivery_street}, ${selectedOrder.delivery_city}`
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
