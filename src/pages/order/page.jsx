"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import Header from "../../components/ui/Layout/Header";
import Footer from "../../components/ui/Layout/Footer";
import "./order.css";

const API_URL = "http://localhost:3000"; 

export default function OrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    street: "",
    kelurahan: "",
    city: "",
    province: "",
    postal_code: "",
    phone_number: "",
  });

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.sub;
    } catch (err) {
      console.error("Gagal decode token:", err);
    }
  }

  // Cek status login saat halaman dimuat
  useEffect(() => {
    if (!token) {
      toast.error("Silakan login terlebih dahulu!");
      navigate("/login");
    }
  }, [navigate, token]); 

  // Load cart dari localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }
  }, []);

  // Hitung subtotal dan total (tanpa diskon)
  const subtotal = useMemo(() => {
    return cart
      .filter((item) => (item.qty || 0) > 0)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const shipping = 5000;
  const total = Math.max(0, subtotal + shipping);

  // Konfirmasi pesanan
  const handleConfirm = async (e) => {
    e.preventDefault();
    alert("Pesanan dikonfirmasi! (demo)");
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
          <h1>Pemesanan</h1>
          <p className="subtitle">Detail Pesanan</p>
        </div>
      </header>

      <main className="order-main">
        <div className="container order-grid">
          <section className="order-form">
            <form onSubmit={handleConfirm} className="form-grid">
              <div className="field-group">
                <label>Nama Depan*</label>
                <input required placeholder="Nama depan" />
              </div>
              <div className="field-group">
                <label>Nama Belakang*</label>
                <input required placeholder="Nama belakang" />
              </div>
              <div className="field-group">
                <label>Kelurahan*</label>
                <input required placeholder="Kelurahan" />
              </div>
              <div className="field-group">
                <label>Nama Perusahaan/Lembaga</label>
                <input placeholder="Nama perusahaan/lembaga" />
              </div>
              <div className="field-group col-2">
                <label>Alamat*</label>
                <input required placeholder="Alamat" />
              </div>
              <div className="field-group">
                <label>Kota*</label>
                <input required placeholder="Kota" />
              </div>
              <div className="field-group">
                <label>Provinsi*</label>
                <input required placeholder="Provinsi" />
              </div>
              <div className="field-group">
                <label>Kode Pos*</label>
                <input required placeholder="Kode pos" />
              </div>
              <div className="field-group">
                <label>No. Telepon*</label>
                <input required placeholder="No. telepon" />
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
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="meta">
                    <div className="name">{item.name}</div>
                    <div className="qty-control">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id || item.product_id || item.uniqueId,
                            -1
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.qty || 0}</span>
                      <button
                        type="button"
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
                <span>Subtotal</span>
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