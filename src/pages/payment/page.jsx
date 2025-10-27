"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import "./payment.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("transfer");
  const [proofs, setProofs] = useState({ transfer: null, qris: null });

  // Load cart dari localStorage
  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("cart") : null;
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Hitung subtotal & total
  const subtotal = useMemo(() => {
    return cart
      .filter((item) => (item.qty || 0) > 0)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const shipping = 5000;
  const total = Math.max(0, subtotal + shipping);

  // Upload bukti pembayaran
  const handleUpload = (e, method) => {
    const file = e.target.files[0];
    if (file) {
      setProofs((prev) => ({ ...prev, [method]: file }));
    }
  };

  // Konfirmasi pembayaran
  const handleConfirmPayment = () => {
    if (!proofs[selectedMethod]) {
      alert("Silakan upload bukti pembayaran terlebih dahulu.");
      return;
    }

    // Ambil semua pesanan dari localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const orderId = window.location.pathname.split("/").pop(); // ambil ID dari URL

    const updatedOrders = orders.map(order => {
      if (String(order.id) === orderId) {
        return {
          ...order,
          paymentProof: proofs[selectedMethod].name,
          paymentMethod: selectedMethod,
          status: "MENUNGGU_KONFIRMASI"
        };
      }
      return order;
    });

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    alert("Bukti pembayaran berhasil dikirim! Menunggu konfirmasi admin.");
    navigate("/order-history");
  };


  return (
    <div className="payment-page">
      <StepNavigation currentStep={3} />

      <header className="payment-header">
        <div className="container">
          <button
            type="button"
            className="payment-back-btn"
            onClick={() => navigate("/order")}
            aria-label="Kembali ke Form Pemesanan"
          >
            ← Kembali ke Form Pemesanan
          </button>
          <h1>Pembayaran</h1>
          <p className="subtitle">
            Harap melakukan pembayaran ke nomor rekening berikut
          </p>
        </div>
      </header>

      <main className="payment-main">
        <div className="container payment-grid">
          {/* Kiri: Metode Pembayaran */}
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
                  {proofs.transfer && (
                    <p className="file-name">{proofs.transfer.name}</p>
                  )}
                </div>
              </div>
            </div>

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
                  {proofs.qris && (
                    <p className="file-name">{proofs.qris.name}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="confirm-row">
              <button
                type="button"
                className="confirm-btn"
                onClick={handleConfirmPayment}
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </section>

          {/* Kanan: Ringkasan Pesanan (sama seperti di OrderPage) */}
          <aside className="order-summary" aria-label="Tinjau Pemesanan">
            <h3>Tinjau Pemesanan</h3>
            <ul className="summary-list">
              {cart.length === 0 && (
                <li className="empty">Keranjang Anda kosong.</li>
              )}
              {cart
                .filter((item) => (item.qty || 0) > 0)
                .map((item) => (
                  <li key={item.id} className="summary-item">
                    <div className="thumb">
                      <img
                        src={
                          item.image ||
                          "/placeholder.svg?height=48&width=48&query=produk"
                        }
                        alt={item.name}
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="meta">
                      <div className="name">{item.name}</div>
                      <div className="desc">Berat: {item.weight || "—"}</div>
                    </div>
                    <div className="price">
                      Rp {(item.price * (item.qty || 0)).toLocaleString("id-ID")}
                    </div>
                  </li>
                ))}
            </ul>

            <div className="totals">
              <div className="row">
                <span>
                  Subtotal ({cart.length} item{cart.length > 1 ? "s" : ""})
                </span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
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
          </aside>
        </div>
      </main>
    </div>
  );
}
