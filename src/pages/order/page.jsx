import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StepNavigation from "../../components/ui/StepNavigation/StepNavigation";
import "./order.css";
import defaultImage from "../../assets/placeHolder.png"
import apiClient from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import LoadingSpinner from "../../components/ui/Layout/LoadingSpinner";

export default function OrderPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    street: "",
    ward: "",
    city: "",
    province: "",
    postal_code: "",
    phone_number: "",
  });

  const userId = useAuthStore((state) => state.user?.sub);
  const authStatus = useAuthStore((state) => state.authStatus);


  useEffect(() => {
    if (authStatus === 'loading') {
      return;
    }

    if (authStatus === 'unauthenticated') {
      toast.warning("Silahkan login terlebih dahulu!");

      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [authStatus, navigate]);

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

  useEffect(() => {
    if (userId) {
      const fetchCheckoutDetails = async () => {
        setIsLoading(true);
        try {

          const res = await apiClient.get(`/orders/form/${userId}`);
          const data = res.data.data;

          setFormData(prev => ({
            ...prev,
            company_name: data.company_name ?? '',
            phone_number: data.phone_number ?? '',
            first_name: data.first_name ?? '',
            last_name: data.last_name ?? '',
            street: data.delivery_address?.street ?? '',
            ward: data.delivery_address?.ward ?? '',
            city: data.delivery_address?.city ?? '',
            province: data.delivery_address?.province ?? '',
            postal_code: data.delivery_address?.postal_code ?? '',
          }));
        } catch (err) {
          console.error("Gagal mengambil data form:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCheckoutDetails();
    }
  }, [userId]);

  // Hitung subtotal dan total
  const subtotal = useMemo(() => {
    return cart
      .filter((item) => (item.qty || 0) > 0)
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const shipping = 5000;
  const discount = 0;
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

    if (!paymentMethod) {
      toast.error("Silakan pilih metode pembayaran terlebih dahulu.");
      return;
    }

    const products = cart
      .filter((item) => item.qty > 0)
      .map((item) => ({
        product_id: item.product_id,
        quantity: item.qty,
      }));

    const orderPayload = {
      products,
      formData: {
        payment_method: paymentMethod || "",
        company_name: formData.company_name || "",
        phone_number: formData.phone_number || "",
        delivery_address: {
          street: formData.street,
          ward: formData.ward || "",
          city: formData.city,
          province: formData.province,
          postal_code: formData.postal_code,
          pic_name: `${formData.first_name} ${formData.last_name}`,
        },
      },
    };

    try {
      const res = await apiClient.post(`/orders/create/${userId}`, orderPayload);

      toast.success("Pesanan berhasil dibuat!");
      const newOrderId = res.data.data.order?.order_id;

      if (newOrderId) {
        localStorage.removeItem("cart");
        navigate("/order-history");
      }

    } catch (err) {
      console.error("Error membuat pesanan:", err);
      toast.error("Gagal membuat pesanan ke server. : ", err);
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

  const handleBack = () => {
    navigate('/catalog');
  };

  const removeFromCart = (product) => {
    setCart((prev) => prev.filter((p) => p.uniqueId !== product.uniqueId));
  };

  if (authStatus === 'loading' || isLoading) {
    return (
      <div className="admin-chat-page">
       <LoadingSpinner text="Memuat..." />
      </div>
    );
  }

  return (
    <>
      <div className="order-page">

        <StepNavigation currentStep={2} />

        <header className="order-header">
          <div className="container">
            <button onClick={handleBack} className="order-back-btn">
              <span>&#8592;</span> Kembali
            </button>
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
                    name="ward"
                    value={formData.ward}
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
                    <input
                      type="radio"
                      name="pay"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={(e) => setPaymentMethod(e.target.value)} />
                    <span>Transfer Bank</span>
                  </label>
                  <label className="radio-row">
                    <input
                      type="radio"
                      name="pay"
                      value="QRIS"
                      checked={paymentMethod === 'QRIS'}
                      onChange={(e) => setPaymentMethod(e.target.value)} />
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
                  <li key={item.product_id} className="summary-item">
                    <div className="thumb">
                      <img
                        src={item.image_url[0] || defaultImage}
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
                          className="qty-btn"
                          onClick={() =>
                            updateQuantity(
                              item.id || item.product_id || item.uniqueId,
                              -1
                            )
                          }
                        >
                          -
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
                        <button
                          type="button"
                          className="del-btn"
                          onClick={() => removeFromCart(item)}
                        >
                          <svg viewBox="0 0 448 512" width="12" height="12" fill="currentColor">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
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
    </>
  );
}