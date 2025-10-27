"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "./AdminOrders.css"
import AdminHeader from "../../../components/features/Admin/AdminHeader"

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      setIsLoggedIn(false);
      navigate("/")
    } else if (role !== "ADMIN") {
      setIsLoggedIn(true);
      navigate("/catalog")
    } else {
      setIsLoggedIn(true); 
    }
  })

  // Load orders
  useEffect(() => {
    const stored = localStorage.getItem("orders") || "[]"
    try {
      setOrders(JSON.parse(stored))
    } catch {
      setOrders([])
    }
  }, [])

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    setOrders(updated)
    localStorage.setItem("orders", JSON.stringify(updated))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

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
                      key={order.id}
                      className={`order-item ${selectedOrder?.id === order.id ? "active" : ""}`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="order-item-header">
                        <div className="order-id">Pesanan #{order.id}</div>
                        <div className="status-badge" style={{ backgroundColor: statusColors[order.status] }}>
                          {statusLabels[order.status]}
                        </div>
                      </div>
                      <div className="order-item-customer">
                        {order.firstName} {order.lastName}
                      </div>
                      <div className="order-item-total">Rp {order.total.toLocaleString("id-ID")}</div>
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
                    {statusOrder.map((status) => (
                      <button
                        key={status}
                        className={`status-btn ${selectedOrder.status === status ? "active" : ""}`}
                        style={{
                          backgroundColor: selectedOrder.status === status ? statusColors[status] : "#e0e0e0",
                          color: selectedOrder.status === status ? "#fff" : "#666",
                        }}
                        onClick={() => updateOrderStatus(selectedOrder.id, status)}
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
                      {selectedOrder.firstName} {selectedOrder.lastName}
                    </strong>
                  </p>
                  <p>{selectedOrder.address}</p>
                  <p>
                    {selectedOrder.city}, {selectedOrder.province} {selectedOrder.postalCode}
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
                          <div className="item-qty">Qty: {item.qty || 1}</div>
                        </div>
                        <div className="item-price">Rp {(item.price * (item.qty || 1)).toLocaleString("id-ID")}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Ringkasan Pembayaran</h3>
                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>Rp {selectedOrder.subtotal.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row">
                      <span>Diskon</span>
                      <span>- Rp {selectedOrder.discount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row">
                      <span>Biaya Pengiriman</span>
                      <span>Rp {selectedOrder.shipping.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row total">
                      <strong>Total</strong>
                      <strong>Rp {selectedOrder.total.toLocaleString("id-ID")}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Metode Pembayaran</h3>
                  <p>{selectedOrder.paymentMethod === "transfer" ? "Transfer Bank" : "QRIS"}</p>
                </div>

                <div className="detail-section">
                  <h3>Tanggal Pesanan</h3>
                  <p>{new Date(selectedOrder.createdAt).toLocaleDateString("id-ID")}</p>
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
