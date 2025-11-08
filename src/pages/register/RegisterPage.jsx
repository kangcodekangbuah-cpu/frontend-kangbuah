import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth, googleProvider } from "../../services/firebase"
import { signInWithPopup } from "firebase/auth"
import AuthLayout from "../../components/features/Auth/AuthLayout";
import AuthInput from "../../components/features/Auth/AuthInput";
import PasswordInput from "../../components/features/Auth/PasswordInput";
import GoogleAuthButton from "../../components/features/Auth/GoogleAuthButton";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import "./RegisterPage.css"
import apiClient from "../../services/api"
import { useAuthStore } from "../../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // ===== REGISTER MANUAL =====
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan konfirmasi password tidak sama!")
      return
    }

    try {
      const res = await apiClient.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        username: formData.name,
        phone_number: formData.phone,
        company_name: null,
        npwp: null,
      })

      toast.success("Registrasi berhasil! Silakan cek email untuk verifikasi lalu login.")
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err)
      toast.error(err.response?.data?.message || "Signup gagal")
    }
  }

  // ===== REGISTER/LOGIN GOOGLE =====
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()

      const res = await apiClient.post("/auth/google/login", { token })

      const accessToken = res.data.data?.accessToken;
      if (!accessToken) {
        throw new Error("Token tidak diterima dari server.");
      }

      setToken(accessToken);
      const role = useAuthStore.getState().user.role;
      toast.success('Login berhasil! Mengalihkan...');

      if (role == "ADMIN") {
        setTimeout(() => {
          navigate("/admin/catalog");
        }, 1500);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Detail Error Google Login:", err);

      if (err.code === 'auth/popup-closed-by-user') {
        toast.info("Proses login dengan Google dibatalkan.");
      } else if (err.response) {
        toast.error(err.response.data.message || "Gagal login dengan Google.");
      } else {
        toast.error("Gagal login dengan Google. Coba lagi nanti.");
      }
    }
  }


  return (
    <AuthLayout>
      <div className="auth-header">
        <h1>Bergabung dengan kami</h1>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <AuthInput label="Nama" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Kang Buah" required />
        <AuthInput label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="supplier.buah@gmail.com" required />
        <AuthInput label="No. Telepon" id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+62 812345678" required />
        <PasswordInput label="Kata Sandi" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Minimal 6 karakter" required />
        <PasswordInput label="Konfirmasi Kata Sandi" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Minimal 6 karakter" required />

        <div className="terms-container">
          <label className="checkbox-container">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              required
            />
            <span className="checkmark"></span>
            Saya setuju dengan Syarat Ketentuan & Kebijakan Privasi
          </label>

        </div>
        <button type="submit" className="auth-submit-btn">Daftar</button>
        <GoogleAuthButton onClick={handleGoogleRegister}>Daftar dengan Google</GoogleAuthButton>

        <div className="auth-footer">
          <span>Sudah punya akun? </span>
          <Link to="/login" className="auth-link">Masuk</Link>
        </div>
      </form>
    </AuthLayout>
  );
}