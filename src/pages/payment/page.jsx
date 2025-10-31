"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import "./payment.css";

const API_URL = "http://localhost:3000";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState("transfer");
  const [proofs, setProofs] = useState({ transfer: null, qris: null });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.data);
      } catch (error) {
        console.error("Gagal mengambil data pesanan:", error);
        toast.error("Gagal memuat data pesanan.");
      }
    };
    fetchOrder();
  }, [orderId]);

  // 🔹 Upload bukti pembayaran (disable reupload)
  const handleUpload = (e, method) => {
    const file = e.target.files[0];
    if (file) {
      setProofs((prev) => ({ ...prev, [method]: file }));
    }
  };

  const handleRemoveProof = (method) => {
    setProofs((prev) => ({ ...prev, [method]: null }));
  };

  // 🔹 Konfirmasi pembayaran
  const handleConfirmPayment = async () => {
    if (!proofs[selectedMethod]) {
      toast.error("Silakan upload bukti pembayaran terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("proof", proofs[selectedMethod]);

    try {
      setUploading(true);
      await axios.post(`${API_URL}/payments/upload-proof/${orderId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Bukti pembayaran berhasil dikirim!");
      navigate("/order-history");
    } catch (error) {
      console.error("Gagal upload bukti pembayaran:", error);
      toast.error(
        error.response?.data?.message || "Gagal mengunggah bukti pembayaran."
      );
    } finally {
      setUploading(false);
    }
  };

  const subtotal = useMemo(() => {
    return order?.total_price || 0;
  }, [order]);

  const shipping = 5000;
  const total = parseFloat(subtotal) + shipping;

  return (
    <div className="payment-page">
      <StepNavigation currentStep={3} />

      <header className="payment-header">
        <div className="container">
          <button onClick={() => navigate(-1)} className="header-btn back-btn">
              <span>&#8592;</span> Kembali
            </button>
          <h1>Pembayaran</h1>
          <p className="subtitle">
            Harap melakukan pembayaran ke nomor rekening berikut
          </p>
        </div>
      </header>

      <main className="payment-main">
        <div className="container payment-grid">
          {/* Kiri: Upload Bukti Pembayaran */}
          <section className="payment-methods">
            <div className="method">
              <label className="radio-row">
                <input
                  type="radio"
                  name="pay"
                  checked={selectedMethod === "transfer"}
                  onChange={() => setSelectedMethod("transfer")}
                />
                <span>TRANSFER BANK</span>
              </label>
              <div className="method-box">
                <p>
                  <strong>BNI</strong> - 1983714283 A/N RAMA AULIA
                </p>
                <div className="upload-box">
                  {!proofs.transfer ? (
                    <label className="upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, "transfer")}
                      />
                      <div className="upload-placeholder">
                        <img
                          src="/placeholder.svg?height=50&width=50"
                          alt="upload"
                        />
                        <p>Upload Bukti Pembayaran</p>
                        <small>JPG, JPEG, PNG (maks. 1MB)</small>
                      </div>
                    </label>
                  ) : (
                    <div className="preview-box">
                      <img
                        src={URL.createObjectURL(proofs.transfer)}
                        alt="Bukti Pembayaran"
                        className="preview-image"
                      />
                      <div className="preview-actions">
                        <p>{proofs.transfer.name}</p>
                        <button
                          onClick={() => handleRemoveProof("transfer")}
                          className="remove-btn"
                        >
                          Ganti File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QRIS */}
            <div className="method">
              <label className="radio-row">
                <input
                  type="radio"
                  name="pay"
                  checked={selectedMethod === "qris"}
                  onChange={() => setSelectedMethod("qris")}
                />
                <span>QRIS</span>
              </label>
              <div className="method-box">
                <img
                  src="/qris-example.png"
                  alt="QRIS QR Code"
                  className="qris-image"
                />
                <div className="upload-box">
                  {!proofs.qris ? (
                    <label className="upload-label">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleUpload(e, "qris")}
                      />
                      <div className="upload-placeholder">
                        <img
                          src="/placeholder.svg?height=50&width=50"
                          alt="upload"
                        />
                        <p>Upload Bukti Pembayaran</p>
                        <small>JPG, JPEG, PNG (maks. 1MB)</small>
                      </div>
                    </label>
                  ) : (
                    <div className="preview-box">
                      <img
                        src={URL.createObjectURL(proofs.qris)}
                        alt="Bukti Pembayaran"
                        className="preview-image"
                      />
                      <div className="preview-actions">
                        <p>{proofs.qris.name}</p>
                        <button
                          onClick={() => handleRemoveProof("qris")}
                          className="remove-btn"
                        >
                          Ganti File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="confirm-row">
              <button
                type="button"
                className="confirm-btn"
                disabled={uploading}
                onClick={handleConfirmPayment}
              >
                {uploading ? "Mengunggah..." : "Konfirmasi Pembayaran"}
              </button>
            </div>
          </section>

          {/* Kanan: Ringkasan Pesanan */}
          <aside className="order-summary" aria-label="Tinjau Pemesanan">
            <h3>Tinjau Pemesanan</h3>

            {!order ? (
              <p className="loading">Memuat pesanan...</p>
            ) : (
              <>
                <ul className="summary-list">
                  {order?.order_details?.map((item) => (
                    <li key={item.order_detail_id} className="summary-item">
                      <div className="thumb">
                        <img
                          src={
                            item.product?.image_url[0] ||
                            "/placeholder.svg?height=48&width=48&query=produk"
                          }
                          alt={item.product?.name}
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="meta">
                        <div className="name">{item.product?.name}</div>
                        <div className="desc">Qty: {item.quantity} x {item.product.unit}</div>
                      </div>
                      <div className="price">
                        Rp {(item.price_per_unit * item.quantity).toLocaleString("id-ID")}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="totals">
                  <div className="row">
                    <span>Subtotal</span>
                    <span>Rp {parseFloat(subtotal).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="row">
                    <span>Biaya Pengiriman</span>
                    <span>Rp {shipping.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="row total">
                    <strong>Total</strong>
                    <strong>Rp {total.toLocaleString("id-ID")}</strong>
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
