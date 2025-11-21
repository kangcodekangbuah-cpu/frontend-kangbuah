"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import "./AdminOrders.css"
import AdminHeader from "../../../components/features/Admin/AdminHeader"
import apiClient from "../../../services/api";
import LoadingSpinner from "../../../components/ui/Layout/LoadingSpinner";
import { useModalStore } from "../../../store/useModalStore";
import NoteModal from "../../../components/ui/Layout/NoteModal";

const statusLabels = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  MENUNGGU_PEMBAYARAN: "Menunggu Pembayaran",
  SEDANG_DIPROSES: "Sedang Diproses",
  DALAM_PENGIRIMAN: "Dalam Pengiriman",
  SELESAI: "Selesai",
  DIBATALKAN: "Dibatalkan",
}

const statusColors = {
  SEDANG_DIPROSES: "#FFA500",
  MENUNGGU_PEMBAYARAN: "#FF6B6B",
  MENUNGGU_VERIFIKASI: "#4ECDC4",
  DALAM_PENGIRIMAN: "#45B7D1",
  SELESAI: "#2ECC71",
  DIBATALKAN: "#95A5A6",
}

const statusOrder = [
  "MENUNGGU_VERIFIKASI",
  "MENUNGGU_PEMBAYARAN",
  "SEDANG_DIPROSES",
  "DALAM_PENGIRIMAN",
  "SELESAI",
  "DIBATALKAN",
]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(true);
  const { openModal, closeModal, setLoading: setModalLoading } = useModalStore.getState();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [isEditingNoteOnly, setIsEditingNoteOnly] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get(`/orders/list`);
        setOrders(res.data.data || res.data.orders || []);
      } catch (err) {
        toast.error("Gagal mengambil data dari backend!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusClick = (status) => {
    if (status === "MENUNGGU_PEMBAYARAN") {
      setPendingStatusUpdate(status);
      setIsEditingNoteOnly(false);
      setIsNoteModalOpen(true);
    }
    else {
      updateOrderStatus(selectedOrder.order_id, status);
    }
  };

  const handleConfirmNote = async (noteContent) => {
    setModalLoading(true);
    try {
      const orderId = selectedOrder.order_id;

      if (isEditingNoteOnly) {
        await apiClient.patch(`/orders/${orderId}/note`, { note: noteContent });
        toast.success("Catatan berhasil diperbarui");

        const updatedOrders = orders.map((o) =>
          o.order_id === orderId ? { ...o, notes: noteContent } : o
        );
        setOrders(updatedOrders);
        setSelectedOrder(prev => ({ ...prev, notes: noteContent }));
      }
      else {
        await apiClient.patch(`/orders/status/${orderId}`, {
          status: pendingStatusUpdate,
          note: noteContent
        });

        toast.success(`Status diubah ke ${statusLabels[pendingStatusUpdate]}`);

        const updatedOrders = orders.map((o) =>
          o.order_id === orderId ? { ...o, status: pendingStatusUpdate, notes: noteContent } : o
        );
        setOrders(updatedOrders);
        setSelectedOrder(prev => ({ ...prev, status: pendingStatusUpdate, notes: noteContent }));
      }

      setIsNoteModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses permintaan");
    } finally {
      setModalLoading(false);
      setPendingStatusUpdate(null);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, note = null) => {
    if (newStatus === "DIBATALKAN") {
      const confirmAction = async () => {
        setModalLoading(true);
        try {
          await apiClient.patch(`/orders/status/${orderId}`, { status: newStatus });

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
          closeModal();
        } catch (error) {
          toast.error("Gagal mengubah status");
          setModalLoading(false);
        }
      };

      openModal({
        title: "Konfirmasi Batalkan Pemesanan",
        message: `Anda yakin ingin batalkan pemesanan ini?`,
        onConfirm: confirmAction,
        confirmText: "Ya",
        cancelText: "Tidak",
        confirmVariant: "danger",
      })
    } else {
      try {
        await apiClient.patch(`/orders/status/${orderId}`, { status: newStatus, note: note });

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
        toast.error("Gagal mengubah status");
      }
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus)

  if (loading) {
    return (
      <div className="admin-chat-page">
        <AdminHeader />
        <LoadingSpinner text="Memuat Data Pesanan..." />
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <AdminHeader />

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
                        {order.user?.username} - {new Date(order.order_date).toLocaleDateString("id-ID")}
                      </div>
                      <div className="order-item-total">Rp {Number(order.total_price)?.toLocaleString("id-ID")}</div>
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
                        onClick={() => handleStatusClick(status)}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="detail-note-section">
                  <div className="detail-note-header">
                    <h3>Catatan Admin</h3>
                    {selectedOrder.status === "MENUNGGU_PEMBAYARAN" && (
                      <button
                        className="btn-edit-note"
                        onClick={() => {
                          setIsEditingNoteOnly(true);
                          setIsNoteModalOpen(true);
                        }}
                      >
                        Ubah Catatan
                      </button>
                    )}
                  </div>
                  {selectedOrder.notes ? (
                    <p className="note-content">{selectedOrder.notes}</p>
                  ) : (
                    <p className="note-empty">Tidak ada catatan.</p>
                  )}
                </div>

                <div className="detail-section">
                  <h3>Informasi Pelanggan</h3>
                  <p>
                    <strong>
                      {selectedOrder.delivery_pic_name} - {selectedOrder.billing_company_name}
                    </strong>
                  </p>
                  <p>{selectedOrder
                    ? `${selectedOrder.delivery_street}`
                    : "Alamat tidak ditemukan"}</p>
                  <p>
                    {selectedOrder.delivery_city}, {selectedOrder.delivery_province} {selectedOrder.delivery_postal_code}
                  </p>
                  <p>Telepon: {selectedOrder.billing_phone_number ? `${selectedOrder.billing_phone_number}` : "-"}</p>
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
                          Rp {Number(item.product?.price * item.quantity).toLocaleString("id-ID")}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Ringkasan Pembayaran</h3>
                  <div className="payment-summary">
                    <div className="summary-row">
                      <span>Diskon</span>
                      <span>- Rp {Number(selectedOrder.discount || 0).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="summary-row total">
                      <strong>Total</strong>
                      <strong>Rp {Number(selectedOrder.total_price || 0).toLocaleString("id-ID")}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Metode Pembayaran</h3>
                  <p>{selectedOrder.payment_method == "BANK_TRANSFER" ? "Transfer Bank" : "QRIS"}</p>
                </div>

                <div className="detail-section">
                  <h3>Tanggal Pesanan</h3>
                  <p>{new Date(selectedOrder.created_at).toLocaleDateString("id-ID")}</p>
                </div>

                {selectedOrder.attachment_url && (
                  <div className="detail-section">
                    <h3>Bukti Pembayaran</h3>
                    <img
                      src={selectedOrder.attachment_url}
                      alt="Bukti Pembayaran"
                      className="payment-proof-image"
                      style={{
                        width: "100%",
                        maxWidth: "300px",
                        borderRadius: "10px",
                        marginTop: "8px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <a
                      href={selectedOrder.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", marginTop: "6px", color: "#3498db" }}
                    >
                      Lihat Gambar Asli
                    </a>
                  </div>
                )}

              </>
            ) : (
              <div className="empty-details">
                <p>Pilih pesanan untuk melihat detail dan ubah status</p>
              </div>
            )}
          </aside>
          <NoteModal
            isOpen={isNoteModalOpen}
            onClose={() => setIsNoteModalOpen(false)}
            onConfirm={handleConfirmNote}
            title={isEditingNoteOnly ? "Edit Catatan Pesanan" : "Catatan Untuk Pelanggan"}
            initialNote={selectedOrder?.notes}
            isLoading={loading}
          />
        </div>
      </main>
    </div>
  )
}
