"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminOrders.css"
import AdminHeader from "../../../components/features/Admin/AdminHeader"

const API_URL = "http://localhost:3000";

const statusLabels = {
  MENUNGGU_PERSETUJUAN: "Menunggu Persetujuan",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  SEDANG_DIPROSES: "Sedang Diproses",
  DALAM_PENGIRIMAN: "Dalam Pengiriman",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
}

const statusColors = {
  MENUNGGU_PERSETUJUAN: "#FFA500",
  MENUNGGU_PEMBAYARAN: "#FF6B6B",
  SEDANG_DIPROSES: "#4ECDC4",
  DALAM_PENGIRIMAN: "#45B7D1",
  SELESAI: "#2ECC71",
  DIBATALKAN: "#95A5A6",
}

const statusOrder = [
  "MENUNGGU_PERSETUJUAN",
  "MENUNGGU_PEMBAYARAN",
  "SEDANG_DIPROSES",
  "DALAM_PENGIRIMAN",
  "SELESAI",
  "DIBATALKAN",
]

export default function AdminOrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(res.data.data || res.data.orders || []);
      } catch (err) {
        console.error("Gagal ambil data dari backend:", err);
        toast.error("Gagal mengambil data dari backend!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="loading">Memuat data pesanan...</div>;
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${API_URL}/orders/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const updatedOrders = orders.map((order) =>
        order.order_id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      setSelectedOrder((prev) =>
        prev && prev.order_id === orderId
          ? { ...prev, status: newStatus }
          : prev
      );

      toast.success(`Status pesanan #${orderId} diubah ke ${statusLabels[newStatus]}`);
    } catch (error) {
      console.error("Gagal update status:", error);
      toast.error("Gagal menyinkronkan ke backend!");
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus)

  return (
    <div className="admin-orders-page">
      <AdminHeader setIsLoggedIn={setIsLoggedIn} />

      <main className="admin-orders-main">
        <div className="container admin-orders-grid">
          {/* Left: Orders List with Filter */}
          <section className="orders-list-section">
            <div className="filter-bar">
              <label>Filter Status:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
                <option value="all">Semua Pesanan</option>
                {statusOrder.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="orders-list">
              {filteredOrders.length === 0 ? (
                <div className="empty-state">
                  <p>Tidak ada pesanan dengan status ini.</p>
                </div>
              ) : (
                <ul>
                  {filteredOrders.map((order) => (
                    <li
                      key={order.order_id}
                      className={`order-item ${selectedOrder?.id === order.order_id ? "active" : ""}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="order-item-header">
                        <div className="order-id">Pesanan #{order.order_id}</div>
                        <div className="status-badge" style={{ backgroundColor: statusColors[order.status] }}>
                          {statusLabels[order.status]}
                        </div>
                      </div>
                      <div className="order-item-customer">
                        {order.user?.first_name} {order.user?.last_name}
                      </div>
                      <div className="order-item-total">Rp {order.total_price?.toLocaleString("id-ID")}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Right: Order Details & Status Update */}
          <aside className="order-details-section">
            {selectedOrder ? (
              <>
                <h2>Detail Pesanan</h2>

                <div className="detail-section">
                  <h3>Ubah Status Pesanan</h3>
                  <div className="status-selector">
                    {console.log("Selected Order:", selectedOrder)}
                    {statusOrder.map((status) => (
                      <button
                        key={status}
                        className={`status-btn ${selectedOrder.status === status ? "active" : ""}`}
                        style={{
                          backgroundColor: selectedOrder.status === status ? statusColors[status] : "#e0e0e0",
                          color: selectedOrder.status === status ? "#fff" : "#666",
                        }}
                        onClick={() => updateOrderStatus(selectedOrder.order_id, status)}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Informasi Pelanggan</h3>
                  <p>
                    <strong>
                      {selectedOrder.user?.first_name} {selectedOrder.user?.last_name}
                    </strong>
                  </p>
                  <p>{selectedOrder.user?.address}</p>
                  <p>
                    {selectedOrder.user?.city}, {selectedOrder.user?.province} {selectedOrder.user?.postalCode}
                  </p>
                  <p>Telepon: {selectedOrder.user?.phone}</p>
                </div>

                <div className="detail-section">
                  <h3>Item Pesanan</h3>
                  <ul className="items-list">
                  {selectedOrder.order_details?.map((item) => (
                    <li key={item.id} className="item-row">
                      <div className="item-info">
                        <div className="item-name">{item.product?.name}</div>
                        <div className="item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="item-price">
                        Rp {(item.product?.price * item.quantity).toLocaleString("id-ID")}
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
                      <span>Rp {(selectedOrder.subtotal || 0).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row">
                      <span>Diskon</span>
                      <span>- Rp {(selectedOrder.discount || 0).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row">
                      <span>Biaya Pengiriman</span>
                      <span>Rp {(selectedOrder.shipping || 0).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row total">
                      <strong>Total</strong>
                      <strong>Rp {(selectedOrder.total_price || 0).toLocaleString("id-ID")}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Metode Pembayaran</h3>
                  <p>{selectedOrder.paymentMethod === "transfer" ? "Transfer Bank" : "QRIS"}</p>
                </div>

                <div className="detail-section">
                  <h3>Tanggal Pesanan</h3>
                  <p>{new Date(selectedOrder.created_at).toLocaleDateString("id-ID")}</p>
                </div>
              </>
            ) : (
              <div className="empty-details">
                <p>Pilih pesanan untuk melihat detail dan ubah status</p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
