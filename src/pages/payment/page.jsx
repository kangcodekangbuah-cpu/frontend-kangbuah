import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import "./payment.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [proofs, setProofs] = useState({ transfer: null, qris: null });
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiClient.get(`/orders/${orderId}`);
        setOrder(res.data.data);
      } catch (error) {
        if (error.response?.status !== 401 && error.response?.status !== 403) {
          toast.error("Gagal memuat data pesanan.");
        }
      }
    };
    if (user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const handleUpload = (e, method) => {
    const file = e.target.files[0];
    if (file) {
      setProofs((prev) => ({ ...prev, [method]: file }));
    }
  };

  const handleRemoveProof = (method) => {
    setProofs((prev) => ({ ...prev, [method]: null }));
  };


  const handleConfirmPayment = async () => {
    const methodKey = order.payment_method === "BANK_TRANSFER" ? "transfer" : "qris";
    const proofFile = proofs[methodKey];

    if (!proofFile) {
      toast.error("Silakan unggah bukti pembayaran terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", proofFile);

    try {
      setUploading(true);
      await apiClient.post(`/payments/upload-proof/${orderId}`, formData);

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
          <button onClick={() => navigate(-1)} className="payment-back-btn">
            <span>&#8592;</span> Kembali
          </button>
          <h1>Pembayaran</h1>
          <p className="subtitle">
            Silahkan Unggah Bukti Pembayaran
          </p>
        </div>
      </header>

      <main className="payment-main">
        <div className="container payment-grid">
          {/* Kiri: Upload Bukti Pembayaran */}
          <section className="payment-methods">
            <>
              {order?.payment_method === 'BANK_TRANSFER' ? (
                <div className="method">
                  <label className="radio-row">
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
              ) : (
                <div className="method">
                  <label className="radio-row">
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
              )}
            </>

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
                        <div className="desc-qty">Qty: {item.quantity} x {item.product.unit}</div>
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
