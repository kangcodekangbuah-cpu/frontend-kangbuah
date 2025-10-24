"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import "./order.css";

export default function OrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

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

  const subtotal = useMemo(() => {
    return cart
      .filter((item) => (item.qty || 0) > 0)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const shipping = 5000;
  const discount = 0; // ✅ Tambahkan variabel diskon (bisa dikembangkan nanti)
  const total = Math.max(0, subtotal + shipping - discount);

  // Konfirmasi pesanan
  const handleConfirm = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const order = {
      id: Date.now(),
      firstName: formData.get("firstName") || "",
      lastName: formData.get("lastName") || "",
      address: formData.get("address") || "",
      city: formData.get("city") || "",
      province: formData.get("province") || "",
      postalCode: formData.get("postalCode") || "",
      phone: formData.get("phone") || "",
      items: cart,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: formData.get("pay") || "transfer",
      status: "MENUNGGU_PERSETUJUAN",
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    // Clear cart and redirect to order history
    localStorage.removeItem("cart");
    navigate("/order-history"); // ✅ ganti dari router.push()
  };

  // Update quantity (bisa sampai 0)
  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) => {
      const itemId = item.id || item.product_id || item.uniqueId;
      if (itemId === id) {
        const newQty = Math.max(0, (item.qty || 0) + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className="order-page">
      <StepNavigation currentStep={2} />

      <header className="order-header">
        <div className="container">
          <button
            type="button"
            className="order-back-btn"
            onClick={() => navigate("/catalog")}
            aria-label="Kembali ke Katalog"
          >
            ← Kembali ke Katalog
          </button>
          <h1>Pemesanan</h1>
          <p className="subtitle">Detail Pesanan</p>
        </div>
      </header>

      <main className="order-main">
        <div className="container order-grid">
          {/* Kiri: Form Pemesanan */}
          <section className="order-form">
            <form onSubmit={handleConfirm} className="form-grid">
              <div className="field-group">
                <label>Nama Depan*</label>
                <input name="firstName" required placeholder="Nama depan" />
              </div>
              <div className="field-group">
                <label>Nama Belakang*</label>
                <input name="lastName" required placeholder="Nama belakang" />
              </div>
              <div className="field-group">
                <label>Kelurahan*</label>
                <input name="address" required placeholder="Kelurahan" />
              </div>
              <div className="field-group">
                <label>Nama Perusahaan/Lembaga</label>
                <input name="company" placeholder="Nama perusahaan/lembaga" />
              </div>
              <div className="field-group col-2">
                <label>Alamat*</label>
                <input name="address" required placeholder="Alamat" />
              </div>
              <div className="field-group">
                <label>Kota*</label>
                <input name="city" required placeholder="Kota" />
              </div>
              <div className="field-group">
                <label>Provinsi*</label>
                <input name="province" required placeholder="Provinsi" />
              </div>
              <div className="field-group">
                <label>Kode Pos*</label>
                <input name="postalCode" required placeholder="Kode pos" />
              </div>
              <div className="field-group">
                <label>No. Telepon*</label>
                <input name="phone" required placeholder="No. telepon" />
              </div>

              <div className="save-info">
                <input type="checkbox" id="saveInfo" />
                <label htmlFor="saveInfo">
                  Simpan informasi saya untuk proses pembayaran yang lebih cepat
                </label>
              </div>

              <hr className="section-sep" />

              {/* Pengiriman */}
              <section className="shipping">
                <h3>Metode Pengiriman</h3>
                <div className="shipping-card">
                  <div>
                    <strong>Tiba pada 7 Juni 2025</strong>
                    <p className="muted">
                      Biaya pengiriman dapat berubah, syarat & ketentuan berlaku
                    </p>
                  </div>
                  <div className="ship-fee">
                    Rp {shipping.toLocaleString("id-ID")}
                  </div>
                </div>
              </section>

              <hr className="section-sep" />

              {/* Pembayaran */}
              <section className="payment">
                <h3>Metode Pembayaran</h3>

                <label className="radio-row">
                  <input type="radio" name="pay" value="transfer" defaultChecked />
                  <span>Transfer Bank</span>
                </label>
                <label className="radio-row">
                  <input type="radio" name="pay" value="qris" />
                  <span>QRIS</span>
                </label>
              </section>

              <div className="confirm-row">
                <button type="submit" className="confirm-btn">
                  Konfirmasi Pesanan
                </button>
              </div>
            </form>
          </section>

          {/* Kanan: Ringkasan Pesanan */}
          <aside className="order-summary" aria-label="Tinjau Pemesanan">
            <h3>Tinjau Pemesanan</h3>
            <ul className="summary-list">
              {cart.length === 0 && (
                <li className="empty">Keranjang Anda kosong.</li>
              )}
              {cart.map((item) => (
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

                    {/* 🔢 Kontrol Quantity */}
                    <div className="qty-control">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(
                            item.id || item.product_id || item.uniqueId,
                            -1
                          )
                        }
                      >
                        −
                      </button>
                      <span className="qty-value">{item.qty || 0}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() =>
                          updateQuantity(
                            item.id || item.product_id || item.uniqueId,
                            1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
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
