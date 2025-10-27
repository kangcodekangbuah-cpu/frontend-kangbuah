"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
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

  // Hitung subtotal dan total
  const subtotal = useMemo(() => {
    return cart
      .filter((item) => (item.qty || 0) > 0)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const shipping = 5000;
  const discount = 0; // Tambahkan variabel diskon (bisa dikembangkan nanti)
  const total = Math.max(0, subtotal + shipping - discount);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Konfirmasi pesanan
  const handleConfirm = async (e) => {
  e.preventDefault();

  if (!userId) {
    toast.error("User belum login");
    return;
  }

  if (cart.length === 0) {
    toast.error("Keranjang masih kosong!");
    return;
  }

  // payload untuk dikirim ke backend
  const products = cart
    .filter((item) => item.qty > 0)
    .map((item) => ({
      product_id: item.product_id || item.id,
      quantity: item.qty,
    }));

  const orderPayload = {
    products,
    formData: {
      company_name: formData.company_name || "",
      phone_number: formData.phone_number || "",
      delivery_address: {
        street: formData.street,
        kelurahan: formData.kelurahan || "",
        city: formData.city,
        province: formData.province,
        postal_code: formData.postal_code,
        pic_name: `${formData.first_name} ${formData.last_name}`,
      },
    },
  };

  try {
    const res = await axios.post(
      `${API_URL}/orders/create/${userId}`,
      orderPayload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Pesanan berhasil dibuat!");
    console.log("Order success:", res.data);

    localStorage.removeItem("cart");
    navigate("/order-history");

  } catch (err) {
    console.error("Error membuat pesanan:", err);
    toast.error("Gagal membuat pesanan ke server. Disimpan lokal sementara.");

    //  Ini bagian fallback — data disimpan lokal
    // const paymentMethod = document.querySelector('input[name="pay"]:checked')?.value || "transfer";

    // const order = {
    //   id: Date.now(),
    //   userId,
    //   firstName: formData.first_name,
    //   lastName: formData.last_name,
    //   address: formData.street,
    //   city: formData.city,
    //   province: formData.province,
    //   postalCode: formData.postal_code,
    //   kelurahan: formData.kelurahan || "",
    //   phone: formData.phone_number || "",
    //   companyName: formData.company_name || "",
    //   items: cart,
    //   subtotal,
    //   discount,
    //   shipping,
    //   total,
    //   paymentMethod,
    //   status: "MENUNGGU_PERSETUJUAN",
    //   createdAt: new Date().toISOString(),
    // };
  }
};


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
                <input
                  required
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Nama depan"
                />
              </div>
              <div className="field-group">
                <label>Nama Belakang*</label>
                <input
                  required
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Nama belakang"
                />
              </div>
              <div className="field-group">
                <label>Kelurahan*</label>
                <input
                  required
                  name="kelurahan"
                  value={formData.kelurahan}
                  onChange={handleChange}
                  placeholder="Kelurahan"
                />
              </div>
              <div className="field-group">
                <label>Nama Perusahaan/Lembaga</label>
                <input
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Nama perusahaan/lembaga"
                />
              </div>
              <div className="field-group col-2">
                <label>Alamat*</label>
                <input
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Alamat lengkap"
                />
              </div>
              <div className="field-group">
                <label>Kota*</label>
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Kota"
                />
              </div>
              <div className="field-group">
                <label>Provinsi*</label>
                <input
                  required
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="Provinsi"
                />
              </div>
              <div className="field-group">
                <label>Kode Pos*</label>
                <input
                  required
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Kode pos"
                />
              </div>
              <div className="field-group">
                <label>No. Telepon*</label>
                <input
                  required
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="No. telepon"
                />
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
                <button type="submit" className="confirm-btn" disabled={cart.length === 0}>
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