import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { auth, googleProvider } from "../../services/firebase"
import { signInWithPopup } from "firebase/auth"
import AuthLayout from "../../components/features/Auth/AuthLayout";
import AuthInput from "../../components/features/Auth/AuthInput";
import PasswordInput from "../../components/features/Auth/PasswordInput";
import GoogleAuthButton from "../../components/features/Auth/GoogleAuthButton";
import "./RegisterPage.css"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      alert("Password dan konfirmasi password tidak sama!")
      return
    }

    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        username: formData.name,
        phone_number: formData.phone,
        company_name: null,
        npwp: null,
      })

      console.log("Signup success:", res.data)
      alert("Registrasi berhasil! Silakan cek email untuk verifikasi lalu login.")
      window.location.href = "/login"
    } catch (err) {
      console.error("Signup error:", err)
      alert(err.response?.data?.message || "Signup gagal")
    }
  }

  // ===== REGISTER/LOGIN GOOGLE =====
  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()

      const res = await axios.post("http://localhost:3000/auth/google/login", { token })

      console.log("Google signup success:", res.data)
      window.location.href = "/catalog"
    } catch (err) {
      console.error("Google signup error:", err)
      alert("Gagal daftar dengan Google")
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